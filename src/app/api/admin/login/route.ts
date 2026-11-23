import { NextRequest, NextResponse } from 'next/server';
import { isIP } from 'node:net';
import { 
  signInAdmin, 
  getAdminRouteSlug
} from '@/lib/admin-auth-supabase';

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const address = forwarded.split(',')[0].trim();
    if (isIP(address)) return address;
  }
  return null;
}

function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') ?? 'unknown';
}

export async function POST(request: NextRequest) {
  // Check if admin emails are configured
  if (
    !process.env.ADMIN_EMAIL_1 ||
    !process.env.ADMIN_EMAIL_2 ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return NextResponse.json(
      { error: 'Admin not configured' },
      { status: 503 }
    );
  }

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
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  const credentials = body as Record<string, unknown>;
  const email = credentials.email;
  const password = credentials.password;
  if (typeof email !== 'string' || email.length > 254 || typeof password !== 'string' || password.length > 1024 || !email || !password) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  // signInAdmin returns the same public error for invalid, disabled and locked accounts.
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);
  
  const result = await signInAdmin(email, password, ip, userAgent);
  
  if (!result.success) {
    // Always return generic error - no email enumeration
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  // Successful login - return the admin route for redirect
  const adminRoute = getAdminRouteSlug();
  
  return NextResponse.json({ 
    ok: true,
    adminRoute,
  });
}
