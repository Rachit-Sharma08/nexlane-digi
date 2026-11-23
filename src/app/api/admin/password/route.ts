import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';

export async function PATCH(request: NextRequest) {
  const supabase = await createAdminSupabaseClient();
  
  // Verify admin session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  const allowedEmails = [
    process.env.ADMIN_EMAIL_1,
    process.env.ADMIN_EMAIL_2,
  ].filter(Boolean).map(e => e!.toLowerCase());
  
  const userEmail = session.user.email?.toLowerCase();
  if (!userEmail || !allowedEmails.includes(userEmail)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  let body: { currentPassword: string; newPassword: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
  
  if (!body.currentPassword || !body.newPassword) {
    return NextResponse.json(
      { error: 'Current and new password are required' },
      { status: 400 }
    );
  }
  
  if (body.newPassword.length < 8) {
    return NextResponse.json(
      { error: 'New password must be at least 8 characters' },
      { status: 400 }
    );
  }
  
  // Verify current password by attempting to sign in
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: userEmail,
    password: body.currentPassword,
  });
  
  if (verifyError) {
    return NextResponse.json(
      { error: 'Current password is incorrect' },
      { status: 401 }
    );
  }
  
  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: body.newPassword,
  });
  
  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ ok: true });
}