import { NextResponse, type NextRequest } from 'next/server';
import { createAdminSupabaseClient } from './lib/supabase/server';
import { createProxySupabaseClient } from './lib/supabase/proxy';
import { getAdminRouteSlug, isAdminLoginPath, isAllowedAdminEmail, validateAdminRouteConfig } from './lib/admin-auth-utils';

const INTERNAL_ADMIN_PATH = '/admin-internal';

function isPath(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

function notFound() {
  return new NextResponse(null, { status: 404 });
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const internalPath = isPath(pathname, INTERNAL_ADMIN_PATH);
  const apiPath = isPath(pathname, '/api/admin');

  let adminSlug: string;
  try {
    adminSlug = getAdminRouteSlug();
  } catch {
    return internalPath || apiPath ? notFound() : NextResponse.next();
  }

  // Runtime enforcement: in production, ADMIN_ROUTE_SLUG must be explicitly set and valid.
  // We validate the raw env var, not the computed slug, so owner can intentionally use '/panel-x7f'.
  if (process.env.NODE_ENV === 'production') {
    const config = validateAdminRouteConfig();
    if (!config.valid) {
      return internalPath || apiPath ? notFound() : NextResponse.next();
    }
  }

  const publicPath = isPath(pathname, adminSlug);
  if (!internalPath && !apiPath && !publicPath) return NextResponse.next();

  if (internalPath) {
    return notFound();
  }

  if (apiPath && pathname === '/api/admin/login' && request.method === 'POST') {
    return NextResponse.next();
  }

  const isLogin = publicPath && isAdminLoginPath(pathname);
  if (isLogin) return NextResponse.next();

  const authConfigured = [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.ADMIN_EMAIL_1,
    process.env.ADMIN_EMAIL_2,
  ].every(Boolean);
  if (!authConfigured) {
    return apiPath
      ? NextResponse.json({ error: 'Admin not configured' }, { status: 503 })
      : NextResponse.redirect(new URL(`${adminSlug}/login`, request.url));
  }

  if (apiPath) {
    const { supabase, getResponse } = createProxySupabaseClient(request);
    const { data: { user }, error } = await supabase.auth.getUser();
    const email = user?.email?.trim().toLowerCase();
    if (error || !email || !isAllowedAdminEmail(email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: account, error: accountError } = await createAdminSupabaseClient()
      .from('admin_accounts')
      .select('is_active')
      .eq('email', email)
      .maybeSingle();
    if (accountError || !account?.is_active) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return getResponse();
  }

  const { supabase, getResponse } = createProxySupabaseClient(request);
  const { data: { user }, error } = await supabase.auth.getUser();
  const email = user?.email?.trim().toLowerCase();
  if (error || !email || !isAllowedAdminEmail(email)) {
    return NextResponse.redirect(new URL(`${adminSlug}/login`, request.url));
  }

  const { data: account, error: accountError } = await createAdminSupabaseClient()
    .from('admin_accounts')
    .select('is_active')
    .eq('email', email)
    .maybeSingle();
  if (accountError || !account?.is_active) {
    return NextResponse.redirect(new URL(`${adminSlug}/login`, request.url));
  }

  return getResponse();
}

export const config = {
  matcher: ['/:path*'],
};
