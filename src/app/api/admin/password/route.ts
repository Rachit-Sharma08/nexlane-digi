import { NextRequest, NextResponse } from 'next/server';
import { changeAdminPassword, getAdminRequestContext } from '@/lib/admin-auth-supabase';

export async function PATCH(request: NextRequest) {
  const adminContext = await getAdminRequestContext();
  if (!adminContext) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
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
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  const input = body as Record<string, unknown>;
  if (typeof input.currentPassword !== 'string' || typeof input.newPassword !== 'string' || !input.currentPassword || !input.newPassword) {
    return NextResponse.json(
      { error: 'Current and new password are required' },
      { status: 400 }
    );
  }
  
  if (input.newPassword.length < 8 || input.newPassword.length > 1024) {
    return NextResponse.json(
      { error: 'New password must be at least 8 characters' },
      { status: 400 }
    );
  }
  
  const result = await changeAdminPassword(input.currentPassword, input.newPassword);
  if (!result.success) {
    const status = result.error === 'Current password is incorrect' || result.error === 'Not authenticated' ? 401 : 500;
    return NextResponse.json({ error: result.error }, { status });
  }

  return NextResponse.json({ ok: true });
}
