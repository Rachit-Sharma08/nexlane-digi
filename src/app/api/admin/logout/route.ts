import { NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function POST() {
  const supabase = await createAdminSupabaseClient();
  
  // Sign out from Supabase Auth
  await supabase.auth.signOut();
  
  const response = NextResponse.json({ ok: true });
  
  // Clear the old cookie if it exists (for backwards compat during transition)
  response.cookies.set('nexlane_admin', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    secure: process.env.NODE_ENV === 'production',
  });
  
  return response;
}