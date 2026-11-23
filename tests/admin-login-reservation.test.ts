import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const authSource = await readFile(new URL('../src/lib/admin-auth-supabase.ts', import.meta.url), 'utf8');
const migration = await readFile(new URL('../supabase/migrations/001_admin_auth.sql', import.meta.url), 'utf8');

test('admin login reservation RPCs match the initial database migration', () => {
  assert.match(authSource, /begin_admin_login_attempt/);
  assert.match(authSource, /finish_admin_login_attempt/);
  assert.match(migration, /function public\.begin_admin_login_attempt\(/);
  assert.match(migration, /function public\.finish_admin_login_attempt\(/);
});

test('login reservations serialize each account and expire without counting as failures', () => {
  assert.equal((migration.match(/pg_advisory_xact_lock/g) ?? []).length, 3);
  assert.match(migration, /v_failures \+ v_pending >= 5/);
  assert.match(migration, /if v_failures >= 5 then/);
  assert.match(migration, /v_reservation\.expires_at <= now\(\)/);
});
