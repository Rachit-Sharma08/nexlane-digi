import { createAdminSupabaseClient } from './supabase/server.ts';
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
 * Records the attempt in the database with lockout tracking.
 */
export async function signInAdmin(
  email: string,
  password: string,
  ip?: string,
  userAgent?: string
): Promise<AdminLoginResult> {
  const supabase = await createAdminSupabaseClient();
  
  // Check if account exists and is active
  const { data: account } = await supabase
    .from('admin_accounts')
    .select('is_active')
    .eq('email', email)
    .single();
  
  // If account exists but is disabled, still record attempt but don't reveal
  if (account && !account.is_active) {
    await supabase.rpc('record_admin_login_attempt', {
      p_email: email,
      p_success: false,
      p_ip: ip ?? null,
      p_user_agent: userAgent ?? null,
    });
    // Generic error - don't reveal if account is disabled or wrong password
    return { success: false, error: 'Invalid credentials' };
  }
  
  // Attempt Supabase Auth sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  const success = !error && !!data.session;
  
  // Record the attempt
  await supabase.rpc('record_admin_login_attempt', {
    p_email: email,
    p_success: success,
    p_ip: ip ?? null,
    p_user_agent: userAgent ?? null,
  });
  
  if (!success) {
    // Check if this attempt caused a lockout
    const { data: lockout } = await supabase.rpc('check_admin_lockout', {
      p_email: email,
    });
    
    return { 
      success: false, 
      error: 'Invalid credentials',
      lockout: lockout ?? false,
    };
  }
  
  // Update last_login_at on successful login
  if (data.user) {
    await supabase
      .from('admin_accounts')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', data.user.id);
  }
  
  return { success: true };
}

/**
 * Sign out the current admin session.
 */
export async function signOutAdmin(): Promise<void> {
  const supabase = await createAdminSupabaseClient();
  await supabase.auth.signOut();
}

/**
 * Get the current admin session (if any).
 */
export async function getAdminSession() {
  const supabase = await createAdminSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
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
  const supabase = await createAdminSupabaseClient();
  
  // Get current session to verify current password
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return { success: false, error: 'Not authenticated' };
  }
  
  // Verify current password by attempting to sign in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: session.user.email!,
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
    return { success: false, error: updateError.message };
  }
  
  return { success: true };
}