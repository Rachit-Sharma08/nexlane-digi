/**
 * Pure utility functions for admin authentication.
 * These have no external dependencies and can be tested in isolation.
 */

export function isAllowedAdminEmail(email: string): boolean {
  const allowedEmails = [process.env.ADMIN_EMAIL_1, process.env.ADMIN_EMAIL_2]
    .map((value) => value?.trim().toLowerCase())
    .filter((value): value is string => Boolean(value));

  return allowedEmails.length === 2 && new Set(allowedEmails).size === 2 &&
    allowedEmails.includes(email.trim().toLowerCase());
}

const reservedAdminRouteSlugs = new Set([
  'about', 'admin', 'admin-internal', 'api', 'audit', 'contact', 'learn',
  'motion-preview', 'our-work', 'portfolio', 'services', 'terms', 'thank-you',
]);

export function isValidAdminRouteSlug(slug: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9_-]{5,63}$/.test(slug) &&
    !reservedAdminRouteSlugs.has(slug.toLowerCase());
}

export function getAdminRouteSlug(): string {
  const slug = process.env.ADMIN_ROUTE_SLUG;

  if (!slug) {
    // Build-time fallback - allows compilation without env var set.
    // Runtime enforcement happens in proxy.ts via validateAdminRouteConfig().
    return '/panel-x7f';
  }

  if (!isValidAdminRouteSlug(slug)) {
    throw new Error('ADMIN_ROUTE_SLUG must be one path segment (6-64 letters, numbers, _ or -)');
  }

  return `/${slug}`;
}

/**
 * Runtime validation: returns true only if ADMIN_ROUTE_SLUG is explicitly
 * set in the environment and valid. Used by proxy to fail closed in production.
 * The owner may intentionally configure '/panel-x7f' as their valid slug,
 * so we must check the raw env var, not the computed slug value.
 */
export function validateAdminRouteConfig(): { valid: boolean; error?: string } {
  const raw = process.env.ADMIN_ROUTE_SLUG;

  if (!raw) {
    return { valid: false, error: 'ADMIN_ROUTE_SLUG is not set' };
  }
  
  if (!isValidAdminRouteSlug(raw)) {
    return { valid: false, error: 'ADMIN_ROUTE_SLUG must be one path segment (6-64 letters, numbers, _ or -)' };
  }
  
  return { valid: true };
}

export function isAdminLoginPath(pathname: string): boolean {
  const slug = getAdminRouteSlug();
  return pathname === `${slug}/login` || pathname === `${slug}/login/`;
}

export function isAdminPath(pathname: string): boolean {
  const slug = getAdminRouteSlug();
  return pathname === slug || pathname.startsWith(`${slug}/`);
}

export function getAdminLoginUrl(): string {
  return `${getAdminRouteSlug()}/login`;
}

export function getAdminDashboardUrl(): string {
  return getAdminRouteSlug();
}
