-- ================================================================
-- Get Lucky Golf — Membership (native in-app, PayFast recurring)
-- Run in Supabase: SQL Editor → New query → Run
--
-- Adds membership state to profiles, an audit table for subscription
-- events, and a guard trigger so clients CANNOT self-grant membership
-- (profiles RLS is `for all using auth.uid()=id`, which would otherwise
-- let any signed-in user flip their own status). All legitimate writes
-- come from the PayFast ITN webhook via the service-role admin client,
-- which connects as `service_role` and is exempted by the trigger.
-- ================================================================

-- ----------------------------------------------------------------
-- 1. ENUMS
-- ----------------------------------------------------------------
do $$ begin
  create type membership_status as enum ('none', 'active', 'past_due', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type membership_plan as enum ('monthly', 'annual');
exception when duplicate_object then null;
end $$;

-- ----------------------------------------------------------------
-- 2. PROFILE COLUMNS
-- ----------------------------------------------------------------
alter table public.profiles
  add column if not exists membership_status        membership_status not null default 'none',
  add column if not exists membership_plan          membership_plan,
  add column if not exists membership_started_at    timestamptz,
  add column if not exists membership_renews_at      timestamptz,
  add column if not exists payfast_subscription_token text;

-- ----------------------------------------------------------------
-- 3. AUDIT TABLE — one row per subscription lifecycle event
-- ----------------------------------------------------------------
do $$ begin
  create type membership_event as enum ('signup', 'renewal', 'cancelled', 'failed');
exception when duplicate_object then null;
end $$;

create table if not exists public.membership_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  plan membership_plan,
  status membership_status not null default 'none',
  event_type membership_event not null,
  m_payment_id text,
  pf_subscription_token text,
  amount_cents integer,
  raw jsonb,
  created_at timestamptz not null default now()
);

alter table public.membership_subscriptions enable row level security;

-- Owners may read their own subscription history. Inserts/updates/deletes
-- have NO policy → only the service-role key (bypasses RLS) can write.
create policy "Users can view their own subscription history"
  on public.membership_subscriptions for select
  using (auth.uid() = user_id);

create index if not exists idx_membership_subs_user_id
  on public.membership_subscriptions (user_id);
create index if not exists idx_membership_subs_created_at
  on public.membership_subscriptions (created_at desc);

-- ----------------------------------------------------------------
-- 4. GUARD TRIGGER — block client writes to membership columns
-- ----------------------------------------------------------------
-- The profiles "for all" RLS policy lets a user UPDATE their own row,
-- including membership_* columns. This BEFORE UPDATE trigger rejects any
-- change to those columns unless the caller is the backend service role.
create or replace function public.guard_membership_columns()
returns trigger
language plpgsql
security invoker
as $$
begin
  -- Backend roles (service-role admin client, migrations, dashboard) are
  -- trusted. PostgREST switches to 'authenticated'/'anon' for client calls.
  if current_user in ('service_role', 'supabase_admin', 'postgres') then
    return new;
  end if;

  if (new.membership_status         is distinct from old.membership_status)
     or (new.membership_plan         is distinct from old.membership_plan)
     or (new.membership_started_at   is distinct from old.membership_started_at)
     or (new.membership_renews_at    is distinct from old.membership_renews_at)
     or (new.payfast_subscription_token is distinct from old.payfast_subscription_token)
  then
    raise exception 'Membership fields are managed by the server and cannot be modified by the client.';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_membership_columns on public.profiles;
create trigger trg_guard_membership_columns
  before update on public.profiles
  for each row execute function public.guard_membership_columns();
