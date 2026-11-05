# Security Policy

## Reporting a security issue

If you find a security vulnerability in this site, **do not open a public issue.*

Email: `TODO_SECURITY_EMAIL` (add a real mailbox here before launch and keep it monitored)

Include:
- What the issue is (short description)
- Steps to reproduce (URL + input)
- Impact you think it has

We will acknowledge within the contact `REPLY_TIME` defined in `src/config/site.ts` and work with you to fix it before any public disclosure.

## Scope

In scope: this website and its server route handlers (forms, API routes).
Out of scope: nothing user-controlled for now.

## Current security measures

- Server-side validation on all form fields (zod), honeypot + min fill time, per-IP rate limiting, same-origin checks on POST.
- Strict security headers (CSP, HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors none).
- No secrets in client code; environment variables via `.env` (never committed, see `.env.example`).
- Branch protection on `main`: pull request + CI required before merge.

Do not rely on this file as legal or security advice: it is a starter policy for a new site.
