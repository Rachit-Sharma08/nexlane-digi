import { NextResponse } from 'next/server';
import { getAdminRequestContext } from '@/lib/admin-auth-supabase';

export async function GET() {
  const admin = await getAdminRequestContext();
  return admin
    ? NextResponse.json({ authenticated: true, email: admin.email })
    : NextResponse.json({ authenticated: false }, { status: 401 });
}
