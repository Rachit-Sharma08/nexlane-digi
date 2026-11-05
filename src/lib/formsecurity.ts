/**
 * Server-side form security helpers.
 *
 * Used by /api/audit and /api/contact route handlers. Rules:
 *  - zod does the field validation (schemas live with each route)
 *  - these helpers add: same-origin check, honeypot, min fill time,
 *    per-IP rate limiting and optional Cloudflare Turnstile verification.
 */

const MIN_FILL_MS = 2500; // form must be open at least this long (bots fill instantly)

/** Reject requests that did not come from our own origin. */
export function sameOriginCheck(req: Request): boolean {
  const origin = req.headers.get("origin");
  // Origin can be absent for some same-origin user agents; treat POST with
  // a hostile origin as the real failure mode.
  if (origin) {
    try {
      const allowed = new Set([new URL(req.url).origin, siteUrlOrigin()]);
      if (!allowed.has(origin)) return false;
    } catch {
      return false;
    }
  }
  return true;
}

function siteUrlOrigin(): string | undefined {
  const raw = process.env.SITE_URL;
  if (!raw) return undefined;
  try {
    return new URL(raw).origin;
  } catch {
    return undefined;
  }
}

/** Honeypot: hidden field that must stay empty (humans never fill it). */
export function notHoneypot(fields: Record<string, unknown>): boolean {
  const hp = fields["company"]; // field deliberately named plausibly
  return typeof hp === "string" && hp.length === 0;
}

/** Minimum fill time: `startedAt` is set when the form mounts. */
export function filledSlowEnough(startedAtMs: number): boolean {
  if (!Number.isFinite(startedAtMs)) return false;
  const spent = Date.now() - startedAtMs;
  // clock can be skewed on client; be generous with an upper sanity bound of 6h
  return spent >= MIN_FILL_MS && spent <= 6 * 60 * 60 * 1000;
}

/** Numbers submitted by the client; only use after rounding to seconds. */
export function clampInt(value: unknown, min: number, max: number): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
}

/**
 * Simple in-memory rate limiter (per IP). Enough as a starter:
 * on serverless it resets between instances, which only *weakens*
 * protection slightly — combine with Turnstile for stronger protection.
 * shortcut: memory-only limit is per lambda instance,
 * upgrade to a shared store (Vercel KV/Upstash) if abuse becomes a problem.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + windowMs });
    // opportunistic cleanup: delete a few expired entries (avoids unbounded growth)
    if (hits.size > 500) {
      for (const [k, v] of hits) {
        if (v.resetAt < now) hits.delete(k);
        if (hits.size <= 400) break;
      }
    }
    return true;
  }
  entry.count += 1;
  return entry.count <= limit;
}

/** Best-effort client IP (Vercel sets x-forwarded-for / x-real-ip). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** Optional Turnstile verification — off unless TURNSTILE_ENABLED=true. */
export async function verifyTurnstile(req: Request, token: string): Promise<boolean> {
  if (process.env.TURNSTILE_ENABLED !== "true") return true; // feature gated off
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false; // enabled but not configured → fail closed
  if (!token || typeof token !== "string" || token.length > 2000) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: clientIp(req) }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false; // network error → fail closed
  }
}

/** Map a zod error to a field → message object so forms can show friendly errors. */
export function zodFieldErrors(error: { issues: { path: (string | number)[]; message: string }[] }): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string") out[key] = issue.message;
  }
  return out;
}
