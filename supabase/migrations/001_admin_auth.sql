-- Phase 2A: Admin authentication tables
-- This migration creates the tables needed for admin login attempt tracking

-- Login attempts table - tracks every login attempt for audit and lockout
create table if not exists admin_login_attempts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  attempted_at timestamptz not null default now(),
  success boolean not null,
  ip inet,
  user_agent text,
  locked_out boolean not null default false
);

-- Index for efficient lockout queries
create index if not exists idx_admin_login_attempts_email_time
  on admin_login_attempts (email, attempted_at desc);

-- Index for admin dashboard queries
create index if not exists idx_admin_login_attempts_attempted_at
  on admin_login_attempts (attempted_at desc);

-- RLS: Only service role can access this table (no public/anon access)
alter table admin_login_attempts enable row level security;

-- Policy: No direct access for authenticated/anon users
-- All access goes through server-side admin API routes using service role
create policy "service_role_full_access" on admin_login_attempts
  for all to service_role
  using (true)
  with check (true);

-- Admin accounts table - mirrors Supabase Auth users for admin-specific data
create table if not exists admin_accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS: Only service role can access
alter table admin_accounts enable row level security;

create policy "service_role_full_access" on admin_accounts
  for all to service_role
  using (true)
  with check (true);

-- Function to check if an account is locked out
-- Returns true if 5+ consecutive failures in last 15 minutes
create or replace function check_admin_lockout(p_email text)
returns boolean
language plpgsql
security invoker
as $$
declare
  v_failed_count int;
begin
  select count(*)
  into v_failed_count
  from admin_login_attempts
  where email = p_email
    and success = false
    and attempted_at > now() - interval '15 minutes'
    and not locked_out;
  
  return v_failed_count >= 5;
end;
$$;

-- Function to record a login attempt atomically
-- Returns the attempt record with lockout status
create or replace function record_admin_login_attempt(
  p_email text,
  p_success boolean,
  p_ip inet default null,
  p_user_agent text default null
)
returns admin_login_attempts
language plpgsql
security invoker
as $$
declare
  v_attempt admin_login_attempts;
  v_locked boolean;
begin
  v_locked := check_admin_lockout(p_email);
  
  insert into admin_login_attempts (email, success, ip, user_agent, locked_out)
  values (p_email, p_success, p_ip, p_user_agent, v_locked)
  returning * into v_attempt;
  
  return v_attempt;
end;
$$;

-- Function to clear lockout for an account (admin action)
create or replace function clear_admin_lockout(p_email text)
returns void
language plpgsql
security invoker
as $$
begin
  update admin_login_attempts
  set locked_out = true
  where email = p_email
    and success = false
    and not locked_out;
end;
$$;

-- Function to disable/enable an admin account
create or replace function set_admin_account_active(p_email text, p_active boolean)
returns admin_accounts
language plpgsql
security invoker
as $$
declare
  v_account admin_accounts;
begin
  update admin_accounts
  set is_active = p_active,
      updated_at = now()
  where email = p_email
  returning * into v_account;
  
  if not found then
    -- Create the account record if it doesn't exist yet
    insert into admin_accounts (id, email, is_active)
    select id, email, p_active
    from auth.users
    where email = p_email
    returning * into v_account;
  end if;
  
  return v_account;
end;
$$;

-- Function to get admin account by email
create or replace function get_admin_account(p_email text)
returns admin_accounts
language plpgsql
security invoker
as $$
declare
  v_account admin_accounts;
begin
  select * into v_account
  from admin_accounts
  where email = p_email;
  
  return v_account;
exception
  when no_data_found then
    return null;
end;
$$;