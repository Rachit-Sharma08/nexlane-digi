import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
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
  
  // Get query params
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '100', 10);
  const email = searchParams.get('email');
  
  let query = supabase
    .from('admin_login_attempts')
    .select('*')
    .order('attempted_at', { ascending: false })
    .limit(limit);
  
  if (email) {
    query = query.eq('email', email);
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
  
  // Clear lockout for an email
  let body: { email: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
  
  if (!body.email || typeof body.email !== 'string') {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
  
  const { error } = await supabase.rpc('clear_admin_lockout', {
    p_email: body.email,
  });
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ ok: true });
}