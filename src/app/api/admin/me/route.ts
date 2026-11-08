import { NextRequest, NextResponse } from 'next/server';
import { verifySessionCookie, getSessionKeyFromEnv } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const sessionKey = await getSessionKeyFromEnv();
  if (!sessionKey) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  const cookie = request.cookies.get('nexlane_admin')?.value;
  if (!cookie || !(await verifySessionCookie(cookie, sessionKey))) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({ authenticated: true });
}