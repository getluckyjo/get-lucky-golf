-- ================================================================
-- Get Lucky Golf — Leads capture (landing page /app)
-- Run in Supabase: SQL Editor → New query → Run
-- ================================================================

do $$ begin
  create type lead_lane as enum ('partner', 'investor');
exception when duplicate_object then null;
end $$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  lane lead_lane not null,
  name text,
  company text,
  note text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- No public policies: leads are written server-side with the service-role
-- key (which bypasses RLS) and read only from the admin panel. RLS stays on
-- so the anon/auth keys cannot read or write this table.

create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_lane on public.leads (lane);
