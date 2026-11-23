import { NextResponse } from 'next/server';
import { signOutAdmin } from '@/lib/admin-auth-supabase';

export async function POST() {
  await signOutAdmin();
  
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
