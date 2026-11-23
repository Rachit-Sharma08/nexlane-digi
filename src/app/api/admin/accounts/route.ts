import { NextRequest, NextResponse } from 'next/server';
import { getAdminRequestContext, isAllowedAdminEmail } from '@/lib/admin-auth-supabase';

export async function GET() {
  const adminContext = await getAdminRequestContext();
  if (!adminContext) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { admin: supabase } = adminContext;
  
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
  const adminContext = await getAdminRequestContext();
  if (!adminContext) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { admin: supabase, email: userEmail } = adminContext;
  
  // Prevent self-disable
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
  
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const input = body as Record<string, unknown>;
  if (typeof input.email !== 'string' || !isAllowedAdminEmail(input.email) || typeof input.is_active !== 'boolean') {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
  
  // Account controls are only for the other configured admin.
  if (input.email.trim().toLowerCase() === userEmail) {
    return NextResponse.json(
      { error: 'You can only manage the other configured admin account' },
      { status: 400 }
    );
  }
  
  // Update account status
  const { data: account, error } = await supabase.rpc('set_admin_account_active', {
    p_email: input.email,
    p_active: input.is_active,
  });
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ account });
}
