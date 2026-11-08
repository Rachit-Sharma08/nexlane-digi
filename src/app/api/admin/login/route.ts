import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, getSessionKeyFromEnv, signSession, timingSafeEqualHex } from '@/lib/admin-auth';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return 'unknown';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) {
    return false;
  }
  entry.count++;
  return true;
}

function clearRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}

export async function POST(request: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json(
      { error: 'Admin not configured' },
      { status: 503 }
    );
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many attempts' },
      { status: 429 }
    );
  }

  let password: string;
  try {
    const body = await request.json();
    password = body.password;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }

  if (!password || typeof password !== 'string') {
    return NextResponse.json(
      { error: 'Wrong password' },
      { status: 401 }
    );
  }

  const [inputHash, envHash] = await Promise.all([
    hashPassword(password),
    hashPassword(adminPassword),
  ]);

  if (!inputHash || !envHash) {
    return NextResponse.json(
      { error: 'Wrong password' },
      { status: 401 }
    );
  }

  const isValid = timingSafeEqualHex(inputHash, envHash);
  
  // Audit log
  const auditEntry = {
    timestamp: new Date().toISOString(),
    action: 'login',
    ip,
    success: isValid,
  };
  await appendAuditLog(auditEntry);

  if (!isValid) {
    return NextResponse.json(
      { error: 'Wrong password' },
      { status: 401 }
    );
  }

  clearRateLimit(ip);

  const sessionKey = await getSessionKeyFromEnv();
  if (!sessionKey) {
    return NextResponse.json(
      { error: 'Admin not configured' },
      { status: 503 }
    );
  }

  const expUnix = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 days
  const cookieValue = await signSession(expUnix, sessionKey);

  const response = NextResponse.json({ ok: true });
  response.cookies.set('nexlane_admin', cookieValue, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 604800,
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}

async function appendAuditLog(entry: Record<string, unknown>): Promise<void> {
  // best-effort: a read-only fs (serverless) must never fail the request
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    const logDir = path.join(process.cwd(), 'data');
    await fs.mkdir(logDir, { recursive: true });
    await fs.appendFile(path.join(logDir, 'admin-audit.log'), JSON.stringify(entry) + '\n', 'utf-8');
  } catch {
    // ignore
  }
}