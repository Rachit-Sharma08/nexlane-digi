import 'server-only';
import { createAdminSupabaseClient, createUserSupabaseClient } from './supabase/server';
import {
  isAllowedAdminEmail,
  getAdminRouteSlug,
  isAdminLoginPath,
  isAdminPath,
  getAdminLoginUrl,
  getAdminDashboardUrl,
} from './admin-auth-utils';

// Re-export for proxy.ts
export { createAdminSupabaseClient };

export interface AdminLoginResult {
  success: boolean;
  error?: string;
  lockout?: boolean;
}

export interface LoginAttempt {
  id: string;
  email: string;
  attempted_at: string;
  success: boolean;
  ip: string | null;
  user_agent: string | null;
  locked_out: boolean;
}

export interface AdminAccount {
  id: string;
  email: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Attempt to sign in an admin using Supabase Auth (email + password).
 * Uses atomic attempt reservation to prevent concurrent login bypass.
 */
export async function signInAdmin(
  email: string,
  password: string,
  ip?: string | null,
  userAgent?: string
): Promise<AdminLoginResult> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!isAllowedAdminEmail(normalizedEmail)) {
    return { success: false, error: 'Invalid credentials' };
  }

  const adminClient = createAdminSupabaseClient();
  const { data, error: reserveError } = await adminClient.rpc('begin_admin_login_attempt', {
    p_email: normalizedEmail.slice(0, 254),
    p_ip: ip ?? null,
    p_user_agent: userAgent?.slice(0, 1000) ?? null,
  });
  if (reserveError || !data || typeof data !== 'object') {
    return { success: false, error: 'Invalid credentials' };
  }
  const reservation = data as { attempt_id?: unknown; locked_out?: unknown };
  if (reservation.locked_out === true || typeof reservation.attempt_id !== 'string') {
    return { success: false, error: 'Invalid credentials', lockout: true };
  }
  const attemptId = reservation.attempt_id;

  const { data: account, error: accountError } = await adminClient
    .from('admin_accounts')
    .select('is_active')
    .eq('email', normalizedEmail)
    .maybeSingle();
  if (accountError || !account?.is_active) {
    await adminClient.rpc('finish_admin_login_attempt', {
      p_attempt_id: attemptId,
      p_success: false,
    });
    return { success: false, error: 'Invalid credentials' };
  }

  let authClient: Awaited<ReturnType<typeof createUserSupabaseClient>> | undefined;
  let success = false;
  try {
    authClient = await createUserSupabaseClient();
    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    success = !authError && !!authData.session;
  } catch {
    try {
      await authClient?.auth.signOut({ scope: 'local' });
    } catch {}
  }

  const { data: finalized, error: finalizeError } = await adminClient.rpc('finish_admin_login_attempt', {
    p_attempt_id: attemptId,
    p_success: success,
  });

  if (finalizeError || finalized !== true) {
    if (success) {
      try {
        await authClient?.auth.signOut({ scope: 'local' });
      } catch {}
    }
    return { success: false, error: 'Invalid credentials' };
  }

  if (!success) {
    return { success: false, error: 'Invalid credentials' };
  }

  return { success: true };
}

/**
 * Sign out the current admin session.
 */
export async function signOutAdmin(): Promise<void> {
  const supabase = await createUserSupabaseClient();
  const { error } = await supabase.auth.signOut({ scope: 'local' });
  if (error) throw error;
}

/**
 * Get the current admin session (if any).
 */
export async function getAdminRequestContext() {
  const auth = await createUserSupabaseClient();
  const { data: { user }, error } = await auth.auth.getUser();
  const email = user?.email?.trim().toLowerCase();
  if (error || !user || !email || !isAllowedAdminEmail(email)) return null;

  const admin = createAdminSupabaseClient();
  const { data: account, error: accountError } = await admin
    .from('admin_accounts')
    .select('is_active')
    .eq('email', email)
    .maybeSingle();
  if (accountError || !account?.is_active) return null;
  return { auth, admin, user, email };
}

// Re-export pure utility functions
export {
  isAllowedAdminEmail,
  getAdminRouteSlug,
  isAdminLoginPath,
  isAdminPath,
  getAdminLoginUrl,
  getAdminDashboardUrl,
};

/**
 * Get all login attempts (for admin dashboard).
 */
export async function getLoginAttempts(limit = 100): Promise<LoginAttempt[]> {
  const supabase = await createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('admin_login_attempts')
    .select('*')
    .order('attempted_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data ?? [];
}

/**
 * Get admin accounts with their status.
 */
export async function getAdminAccounts(): Promise<AdminAccount[]> {
  const supabase = await createAdminSupabaseClient();
  const { data, error } = await supabase
    .from('admin_accounts')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data ?? [];
}

/**
 * Clear lockout for an admin account (admin action).
 */
export async function clearLockout(email: string): Promise<void> {
  const supabase = await createAdminSupabaseClient();
  const { error } = await supabase.rpc('clear_admin_lockout', {
    p_email: email,
  });
  if (error) throw error;
}

/**
 * Set admin account active/inactive status (admin action).
 */
export async function setAccountActive(email: string, active: boolean): Promise<AdminAccount> {
  const supabase = await createAdminSupabaseClient();
  const { data, error } = await supabase.rpc('set_admin_account_active', {
    p_email: email,
    p_active: active,
  });
  if (error) throw error;
  return data;
}

/**
 * Change admin password (self-service, requires current password).
 */
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createUserSupabaseClient();
  
  // Get current session to verify current password
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email || !isAllowedAdminEmail(user.email)) {
    return { success: false, error: 'Not authenticated' };
  }
  
  // Verify current password by attempting to sign in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  
  if (verifyError) {
    return { success: false, error: 'Current password is incorrect' };
  }
  
  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (updateError) {
    return { success: false, error: 'Could not update password' };
  }

  const { error: revokeError } = await supabase.auth.signOut({ scope: 'others' });
  if (revokeError) return { success: false, error: 'Password updated, but other sessions could not be revoked' };
  
  return { success: true };
}
