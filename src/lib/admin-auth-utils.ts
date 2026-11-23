/**
 * Pure utility functions for admin authentication.
 * These have no external dependencies and can be tested in isolation.
 */

export function isAllowedAdminEmail(email: string): boolean {
  const allowedEmails = [
    process.env.ADMIN_EMAIL_1,
    process.env.ADMIN_EMAIL_2,
  ].filter(Boolean).map(e => e!.toLowerCase());
  
  return allowedEmails.includes(email.toLowerCase());
}

export function getAdminRouteSlug(): string {
  const slug = process.env.ADMIN_ROUTE_SLUG;
  
  if (!slug) {
    // Dev-only fallback - never use in production
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ADMIN_ROUTE_SLUG must be set in production');
    }
    return '/panel-x7f'; // Non-obvious dev fallback
  }
  
  // Validate slug format
  if (!slug.startsWith('/') || slug.length < 2 || slug.includes('//')) {
    throw new Error('ADMIN_ROUTE_SLUG must be a valid path starting with /');
  }
  
  return slug;
}

export function isAdminLoginPath(pathname: string): boolean {
  const slug = getAdminRouteSlug();
  return pathname === `${slug}/login` || pathname === `${slug}/login/`;
}

export function isAdminPath(pathname: string): boolean {
  const slug = getAdminRouteSlug();
  return pathname.startsWith(slug);
}

export function getAdminLoginUrl(): string {
  return `${getAdminRouteSlug()}/login`;
}

export function getAdminDashboardUrl(): string {
  return getAdminRouteSlug();
}