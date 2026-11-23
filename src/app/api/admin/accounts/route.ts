import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createAdminSupabaseClient();
  
  // Verify admin session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const allowedEmails = [
    process.env.ADMIN_EMAIL_1,
    process.env.ADMIN_EMAIL_2,
  ].filter(Boolean).map(e => e!.toLowerCase());
  
  const userEmail = session.user.email?.toLowerCase();
  if (!userEmail || !allowedEmails.includes(userEmail)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Get admin accounts
  const { data: accounts, error } = await supabase
    .from('admin_accounts')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ accounts: accounts ?? [] });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createAdminSupabaseClient();
  
  // Verify admin session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const allowedEmails = [
    process.env.ADMIN_EMAIL_1,
    process.env.ADMIN_EMAIL_2,
  ].filter(Boolean).map(e => e!.toLowerCase());
  
  const userEmail = session.user.email?.toLowerCase();
  if (!userEmail || !allowedEmails.includes(userEmail)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Prevent self-disable
  let body: { email: string; is_active: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
  
  if (!body.email || typeof body.is_active !== 'boolean') {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
  
  // Prevent disabling yourself
  if (body.email.toLowerCase() === userEmail && body.is_active === false) {
    return NextResponse.json(
      { error: 'Cannot disable your own account' },
      { status: 400 }
    );
  }
  
  // Update account status
  const { data: account, error } = await supabase.rpc('set_admin_account_active', {
    p_email: body.email,
    p_active: body.is_active,
  });
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  // If disabling, sign out the user's sessions
  if (!body.is_active) {
    await supabase.auth.admin.signOut(body.email);
  }
  
  return NextResponse.json({ account });
}