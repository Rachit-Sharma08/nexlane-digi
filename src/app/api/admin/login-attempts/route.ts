import { NextRequest, NextResponse } from 'next/server';
import { getAdminRequestContext, isAllowedAdminEmail } from '@/lib/admin-auth-supabase';

export async function GET(request: NextRequest) {
  const adminContext = await getAdminRequestContext();
  if (!adminContext) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { admin: supabase } = adminContext;
  
  // Get query params
  const { searchParams } = new URL(request.url);
  const requestedLimit = Number.parseInt(searchParams.get('limit') || '100', 10);
  const limit = Number.isFinite(requestedLimit) ? Math.min(100, Math.max(1, requestedLimit)) : 100;
  const email = searchParams.get('email');
  
  let query = supabase
    .from('admin_login_attempts')
    .select('*')
    .order('attempted_at', { ascending: false })
    .limit(limit);
  
  if (email && isAllowedAdminEmail(email)) {
    query = query.eq('email', email.trim().toLowerCase());
  } else if (email) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  
  const { data: attempts, error } = await query;
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ attempts: attempts ?? [] });
}

export async function POST(request: NextRequest) {
  const adminContext = await getAdminRequestContext();
  if (!adminContext) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { admin: supabase } = adminContext;
  
  // Clear lockout for an email
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
  
  if (!body || typeof body !== 'object' || typeof (body as Record<string, unknown>).email !== 'string' ||
      !isAllowedAdminEmail((body as { email: string }).email)) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
  const email = (body as { email: string }).email.trim().toLowerCase();
  
  const { error } = await supabase.rpc('clear_admin_lockout', {
    p_email: email,
  });
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ ok: true });
}
