import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionCookie, getSessionKeyFromEnv } from './lib/admin-auth';

export async function proxy(request: NextRequest) {
  const sessionKey = await getSessionKeyFromEnv();
  if (!sessionKey) {
    // Admin not configured, deny access (except login page)
    if (request.nextUrl.pathname.startsWith('/api/admin') && !request.nextUrl.pathname.startsWith('/api/admin/login')) {
      return NextResponse.json(
        { error: 'Admin not configured' },
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!request.nextUrl.pathname.startsWith('/api/admin/login') && !request.nextUrl.pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  const cookie = request.cookies.get('nexlane_admin')?.value;
  // Allow login routes without cookie
  if (!cookie || !(await verifySessionCookie(cookie, sessionKey))) {
    if (request.nextUrl.pathname.startsWith('/api/admin') && !request.nextUrl.pathname.startsWith('/api/admin/login')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!request.nextUrl.pathname.startsWith('/api/admin/login') && !request.nextUrl.pathname.startsWith('/admin/login')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
