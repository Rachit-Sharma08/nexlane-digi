import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  
  // Audit log
  const auditEntry = {
    timestamp: new Date().toISOString(),
    action: 'logout',
    ip,
    success: true,
  };
  await appendAuditLog(auditEntry);

  const response = NextResponse.json({ ok: true });
  response.cookies.set('nexlane_admin', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
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