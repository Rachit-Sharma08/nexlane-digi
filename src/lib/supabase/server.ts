import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

function supabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) throw new Error('NEXT_PUBLIC_SUPABASE_URL is required');
  return value;
}

export async function createUserSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    supabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Components cannot write cookies; Proxy refreshes those sessions.
          }
        },
      },
    },
  );
}

export function createAdminSupabaseClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is required');
  return createClient(supabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
