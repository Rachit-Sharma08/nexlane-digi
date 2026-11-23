import { NextRequest, NextResponse } from 'next/server';
import { 
  signInAdmin, 
  getAdminRouteSlug
} from '@/lib/admin-auth-supabase';

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return 'unknown';
}

function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') ?? 'unknown';
}

export async function POST(request: NextRequest) {
  // Check if admin emails are configured
  if (!process.env.ADMIN_EMAIL_1 || !process.env.ADMIN_EMAIL_2) {
    return NextResponse.json(
      { error: 'Admin not configured' },
      { status: 503 }
    );
  }

  let email: string;
  let password: string;
  
  try {
    const body = await request.json();
    email = body.email;
    password = body.password;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  // Always attempt sign in to avoid timing attacks revealing allowed emails
  // The signInAdmin function handles disabled accounts and lockouts internally
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