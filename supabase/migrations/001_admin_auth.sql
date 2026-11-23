create table public.admin_accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_login_attempts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  attempted_at timestamptz not null default now(),
  success boolean not null,
  ip inet,
  user_agent text,
  locked_out boolean not null default false
);

create index admin_login_attempts_email_time_idx on public.admin_login_attempts (email, attempted_at desc);
create index admin_login_attempts_time_idx on public.admin_login_attempts (attempted_at desc);

create table public.admin_login_lockouts (
  email text primary key,
  locked_until timestamptz not null
);

create table public.admin_login_reservations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  reserved_at timestamptz not null default now(),
  expires_at timestamptz not null,
  ip inet,
  user_agent text
);

create index admin_login_reservations_email_expiry_idx on public.admin_login_reservations (email, expires_at);

alter table public.admin_accounts enable row level security;
alter table public.admin_login_attempts enable row level security;
alter table public.admin_login_lockouts enable row level security;
alter table public.admin_login_reservations enable row level security;

create policy admin_accounts_service_role on public.admin_accounts for all to service_role using (true) with check (true);
create policy admin_attempts_service_role on public.admin_login_attempts for all to service_role using (true) with check (true);
create policy admin_lockouts_service_role on public.admin_login_lockouts for all to service_role using (true) with check (true);
create policy admin_reservations_service_role on public.admin_login_reservations for all to service_role using (true) with check (true);

revoke all on public.admin_accounts, public.admin_login_attempts, public.admin_login_lockouts, public.admin_login_reservations from anon, authenticated;
grant all on public.admin_accounts, public.admin_login_attempts, public.admin_login_lockouts, public.admin_login_reservations to service_role;

create or replace function public.begin_admin_login_attempt(
  p_email text, p_ip inet default null, p_user_agent text default null
)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare
  v_email text := lower(trim(p_email));
  v_failures bigint;
  v_pending bigint;
  v_locked_until timestamptz;
  v_attempt_id uuid;
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_email, 0));

  select locked_until into v_locked_until
    from public.admin_login_lockouts where email = v_email for update;
  if v_locked_until > now() then
    insert into public.admin_login_attempts(email, success, ip, user_agent, locked_out)
      values (v_email, false, p_ip, left(p_user_agent, 1000), true);
    return pg_catalog.jsonb_build_object('attempt_id', null, 'locked_out', true);
  end if;
  delete from public.admin_login_lockouts where email = v_email;

  delete from public.admin_login_reservations
    where email = v_email and expires_at <= now();

  select count(*) into v_failures from public.admin_login_attempts a
    where a.email = v_email and not a.success and not a.locked_out
      and a.attempted_at > now() - interval '15 minutes'
      and a.attempted_at > coalesce(
        (select max(s.attempted_at) from public.admin_login_attempts s where s.email = v_email and s.success),
        '-infinity'::timestamptz
      );
  select count(*) into v_pending from public.admin_login_reservations r
    where r.email = v_email and r.expires_at > now();

  if v_failures >= 5 then
    insert into public.admin_login_lockouts(email, locked_until)
      values (v_email, now() + interval '15 minutes')
      on conflict (email) do update set locked_until = excluded.locked_until
      where public.admin_login_lockouts.locked_until <= now();
    insert into public.admin_login_attempts(email, success, ip, user_agent, locked_out)
      values (v_email, false, p_ip, left(p_user_agent, 1000), true);
    return pg_catalog.jsonb_build_object('attempt_id', null, 'locked_out', true);
  end if;

  -- Pending attempts consume the five available slots but do not count as failures.
  if v_failures + v_pending >= 5 then
    insert into public.admin_login_attempts(email, success, ip, user_agent, locked_out)
      values (v_email, false, p_ip, left(p_user_agent, 1000), true);
    return pg_catalog.jsonb_build_object('attempt_id', null, 'locked_out', true);
  end if;

  insert into public.admin_login_reservations(email, expires_at, ip, user_agent)
    values (v_email, now() + interval '15 minutes', p_ip, left(p_user_agent, 1000))
    returning id into v_attempt_id;
  return pg_catalog.jsonb_build_object('attempt_id', v_attempt_id, 'locked_out', false);
end;
$$;

create or replace function public.finish_admin_login_attempt(p_attempt_id uuid, p_success boolean)
returns boolean language plpgsql security invoker set search_path = '' as $$
declare
  v_email text;
  v_reservation public.admin_login_reservations;
  v_failures bigint;
  v_attempt_id uuid;
begin
  select email into v_email from public.admin_login_reservations where id = p_attempt_id;
  if not found then return false; end if;

  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(v_email, 0));
  select * into v_reservation from public.admin_login_reservations where id = p_attempt_id for update;
  if not found then return false; end if;
  delete from public.admin_login_reservations where id = p_attempt_id;
  if v_reservation.expires_at <= now() then return false; end if;

  insert into public.admin_login_attempts(email, success, ip, user_agent, locked_out)
    values (v_email, p_success, v_reservation.ip, v_reservation.user_agent, false)
    returning id into v_attempt_id;

  if p_success then
    delete from public.admin_login_lockouts where email = v_email;
    update public.admin_accounts set last_login_at = now(), updated_at = now() where email = v_email;
    return true;
  end if;

  select count(*) into v_failures from public.admin_login_attempts a
    where a.email = v_email and not a.success and not a.locked_out
      and a.attempted_at > now() - interval '15 minutes'
      and a.attempted_at > coalesce(
        (select max(s.attempted_at) from public.admin_login_attempts s where s.email = v_email and s.success),
        '-infinity'::timestamptz
      );
  if v_failures >= 5 then
    update public.admin_login_attempts set locked_out = true where id = v_attempt_id;
    insert into public.admin_login_lockouts(email, locked_until)
      values (v_email, now() + interval '15 minutes')
      on conflict (email) do update set locked_until = excluded.locked_until
      where public.admin_login_lockouts.locked_until <= now();
  end if;
  return true;
end;
$$;

create or replace function public.clear_admin_lockout(p_email text)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(lower(trim(p_email)), 0));
  delete from public.admin_login_lockouts where email = lower(trim(p_email));
  delete from public.admin_login_reservations where email = lower(trim(p_email));
  update public.admin_login_attempts set locked_out = true
    where email = lower(trim(p_email)) and not success and not locked_out
      and attempted_at > now() - interval '15 minutes';
end;
$$;

create or replace function public.set_admin_account_active(p_email text, p_active boolean)
returns public.admin_accounts language plpgsql security invoker set search_path = '' as $$
declare v_account public.admin_accounts;
begin
  update public.admin_accounts set is_active = p_active, updated_at = now()
    where email = lower(trim(p_email)) returning * into v_account;
  return v_account;
end;
$$;

revoke all on function public.begin_admin_login_attempt(text, inet, text) from public, anon, authenticated;
revoke all on function public.finish_admin_login_attempt(uuid, boolean) from public, anon, authenticated;
revoke all on function public.clear_admin_lockout(text) from public, anon, authenticated;
revoke all on function public.set_admin_account_active(text, boolean) from public, anon, authenticated;
grant execute on function public.begin_admin_login_attempt(text, inet, text) to service_role;
grant execute on function public.finish_admin_login_attempt(uuid, boolean) to service_role;
grant execute on function public.clear_admin_lockout(text) to service_role;
grant execute on function public.set_admin_account_active(text, boolean) to service_role;
