import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { 
  createAdminSupabaseClient, 
  getAdminRouteSlug,
  isAdminLoginPath 
} from './lib/admin-auth-supabase';

export async function proxy(request: NextRequest) {
  const adminSlug = getAdminRouteSlug();
  const pathname = request.nextUrl.pathname;
  
  // Allow login routes without authentication (both public slug and internal)
  if (isAdminLoginPath(pathname) || pathname === '/admin-internal/login' || pathname === '/admin-internal/login/') {
    return NextResponse.next();
  }
  
  // Check if this is an admin path (public slug or internal)
  const isAdminPublicPath = pathname.startsWith(adminSlug);
  const isAdminInternalPath = pathname.startsWith('/admin-internal');
  const isAdminApiPath = pathname.startsWith('/api/admin');
  
  if (!isAdminPublicPath && !isAdminInternalPath && !isAdminApiPath) {
    return NextResponse.next();
  }
  
  // For admin paths (including API), verify session
  const supabase = await createAdminSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // No session - redirect to login for pages, 401 for APIs
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return NextResponse.redirect(new URL(`${adminSlug}/login`, request.url));
  }
  
  // Verify the user is one of the allowed admin emails
  const allowedEmails = [
    process.env.ADMIN_EMAIL_1,
    process.env.ADMIN_EMAIL_2,
  ].filter(Boolean).map(e => e!.toLowerCase());
  
  const userEmail = session.user.email?.toLowerCase();
  if (!userEmail || !allowedEmails.includes(userEmail)) {
    // Sign out the invalid session
    await supabase.auth.signOut();
    
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return NextResponse.redirect(new URL(`${adminSlug}/login`, request.url));
  }
  
  // Check if account is active
  const { data: account } = await supabase
    .from('admin_accounts')
    .select('is_active')
    .eq('email', userEmail)
    .single();
  
  if (account && !account.is_active) {
    // Account disabled - sign out
    await supabase.auth.signOut();
    
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return NextResponse.redirect(new URL(`${adminSlug}/login`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin-internal/:path*', '/api/admin/:path*'],
};