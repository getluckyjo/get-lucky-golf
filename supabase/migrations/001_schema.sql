-- ================================================================
-- Get Lucky Golf — Complete Database Schema
-- Run this in your Supabase project: SQL Editor → New query → Run
-- ================================================================

-- ----------------------------------------------------------------
-- 1. PROFILES (extends auth.users)
-- ----------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  handicap integer,
  home_course_id uuid,
  payment_method text,
  payment_token text,
  onboarding_done boolean not null default false,
  payment_setup_done boolean not null default false,
  total_attempts integer not null default 0,
  is_admin boolean not null default false,
  suspended_at timestamptz,
  suspended_reason text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can manage their own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Atomically increment total_attempts (called fire-and-forget from bet creation)
create or replace function public.increment_attempts(user_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set total_attempts = total_attempts + 1
  where id = user_id;
end;
$$;

-- ----------------------------------------------------------------
-- 2. COURSES
-- ----------------------------------------------------------------
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location_text text,
  region text,
  country text not null default 'South Africa',
  lat double precision,
  lng double precision,
  is_partner boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.courses enable row level security;

create policy "Courses are publicly readable"
  on public.courses for select using (true);

-- ----------------------------------------------------------------
-- 3. HOLES (par-3 holes per course)
-- ----------------------------------------------------------------
create table if not exists public.holes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses on delete cascade,
  hole_number integer not null,
  par integer not null default 3,
  distance_metres integer,
  is_active boolean not null default true,
  jackpot_amount integer not null default 50000,
  created_at timestamptz not null default now(),
  unique (course_id, hole_number)
);

alter table public.holes enable row level security;

create policy "Holes are publicly readable"
  on public.holes for select using (true);

-- ----------------------------------------------------------------
-- 4. ENUMS
-- ----------------------------------------------------------------
do $$ begin
  create type bet_tier as enum ('tier_1', 'tier_2', 'tier_3', 'tier_4', 'tier_5');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type bet_status as enum ('active', 'miss', 'claimed', 'verified', 'paid');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type verification_status as enum (
    'pending', 'documents_received', 'under_review', 'approved', 'rejected'
  );
exception when duplicate_object then null;
end $$;

-- ----------------------------------------------------------------
-- 5. BETS
-- ----------------------------------------------------------------
create table if not exists public.bets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  course_id uuid not null references public.courses,
  hole_id uuid not null references public.holes,
  tier bet_tier not null,
  stake_pence integer not null,
  potential_win_pence integer not null,
  status bet_status not null default 'active',
  payment_intent_id text,
  video_url text,
  declared_result text check (declared_result in ('miss', 'win')),
  declared_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.bets enable row level security;

-- Granular policies (no DELETE — users cannot delete bets)
create policy "Users can view their own bets"
  on public.bets for select
  using (auth.uid() = user_id);

create policy "Users can create bets"
  on public.bets for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bets"
  on public.bets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- 6. VERIFICATIONS
-- ----------------------------------------------------------------
create table if not exists public.verifications (
  id uuid primary key default gen_random_uuid(),
  bet_id uuid not null unique references public.bets on delete cascade,
  status verification_status not null default 'pending',
  certificate_path text,
  affidavit_path text,
  footage_received_at timestamptz,
  documents_received_at timestamptz,
  verified_at timestamptz,
  payout_initiated_at timestamptz,
  reviewer_notes text,
  reviewed_by uuid references auth.users,
  created_at timestamptz not null default now()
);

alter table public.verifications enable row level security;

create policy "Users can view verifications for their own bets"
  on public.verifications for select
  using (
    exists (
      select 1 from public.bets
      where bets.id = verifications.bet_id
      and bets.user_id = auth.uid()
    )
  );

create policy "Users can create verifications for their own bets"
  on public.verifications for insert
  with check (
    exists (
      select 1 from public.bets
      where bets.id = verifications.bet_id
      and bets.user_id = auth.uid()
    )
  );

create policy "Users can update verifications for their own bets"
  on public.verifications for update
  using (
    exists (
      select 1 from public.bets
      where bets.id = verifications.bet_id
      and bets.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.bets
      where bets.id = verifications.bet_id
      and bets.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------
-- 7. PERFORMANCE INDEXES
-- ----------------------------------------------------------------
create index if not exists idx_bets_user_id on public.bets (user_id);
create index if not exists idx_bets_status on public.bets (status);
create index if not exists idx_bets_course_id on public.bets (course_id);
create index if not exists idx_verifications_status on public.verifications (status);

-- ----------------------------------------------------------------
-- 8. STORAGE BUCKETS
-- ----------------------------------------------------------------

-- shot-videos: user-uploaded hole-in-one recordings
insert into storage.buckets (id, name, public)
values ('shot-videos', 'shot-videos', false)
on conflict (id) do nothing;

-- verification-docs: certificates and affidavits
insert into storage.buckets (id, name, public)
values ('verification-docs', 'verification-docs', false)
on conflict (id) do nothing;

-- Storage policies: shot-videos
create policy "Users can upload shot videos"
  on storage.objects for insert
  with check (
    bucket_id = 'shot-videos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can view own shot videos"
  on storage.objects for select
  using (
    bucket_id = 'shot-videos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Storage policies: verification-docs (authenticated users)
create policy "Users can upload verification docs"
  on storage.objects for insert
  with check (
    bucket_id = 'verification-docs'
    and auth.role() = 'authenticated'
  );

create policy "Users can update verification docs"
  on storage.objects for update
  using (
    bucket_id = 'verification-docs'
    and auth.role() = 'authenticated'
  );

create policy "Users can view verification docs"
  on storage.objects for select
  using (
    bucket_id = 'verification-docs'
    and auth.role() = 'authenticated'
  );

-- ----------------------------------------------------------------
-- 9. SEED DATA: South African golf courses + par-3 holes
-- ----------------------------------------------------------------
insert into public.courses (id, name, location_text, region, country, lat, lng, is_partner) values
  ('11111111-0000-0000-0000-000000000001', 'Boschenmeer Golf Club', 'Paarl, Western Cape', 'Western Cape', 'South Africa', -33.7248, 18.9556, true),
  ('11111111-0000-0000-0000-000000000002', 'Atlantic Beach Estate', 'Melkbosstrand, Western Cape', 'Western Cape', 'South Africa', -33.7295, 18.4661, true),
  ('11111111-0000-0000-0000-000000000003', 'Serengeti Estates Golf Club', 'Kempton Park, Gauteng', 'Gauteng', 'South Africa', -26.0014, 28.2600, false),
  ('11111111-0000-0000-0000-000000000004', 'Fancourt Golf Estate', 'George, Western Cape', 'Western Cape', 'South Africa', -33.9826, 22.3987, true),
  ('11111111-0000-0000-0000-000000000005', 'Pearl Valley Golf Estate', 'Franschhoek, Western Cape', 'Western Cape', 'South Africa', -33.8418, 19.0264, true),
  ('11111111-0000-0000-0000-000000000006', 'Steenberg Golf Club', 'Tokai, Western Cape', 'Western Cape', 'South Africa', -34.0608, 18.4468, false),
  ('11111111-0000-0000-0000-000000000007', 'Zimbali Country Club', 'Ballito, KwaZulu-Natal', 'KwaZulu-Natal', 'South Africa', -29.4948, 31.1647, true),
  ('11111111-0000-0000-0000-000000000008', 'Sun City Golf Estate', 'Sun City, North West', 'North West', 'South Africa', -25.3399, 27.0949, false),
  ('11111111-0000-0000-0000-000000000009', 'Leopard Creek Country Club', 'Malelane, Mpumalanga', 'Mpumalanga', 'South Africa', -25.4819, 31.5488, true),
  ('11111111-0000-0000-0000-000000000010', 'Erinvale Golf Club', 'Somerset West, Western Cape', 'Western Cape', 'South Africa', -34.1108, 18.8612, false)
on conflict (id) do nothing;

-- Par-3 holes for each course (2–3 par-3 holes per course)
insert into public.holes (course_id, hole_number, par, distance_metres, jackpot_amount) values
  -- Boschenmeer
  ('11111111-0000-0000-0000-000000000001', 3, 3, 178, 50000),
  ('11111111-0000-0000-0000-000000000001', 7, 3, 162, 50000),
  ('11111111-0000-0000-0000-000000000001', 14, 3, 195, 50000),
  -- Atlantic Beach
  ('11111111-0000-0000-0000-000000000002', 5, 3, 143, 50000),
  ('11111111-0000-0000-0000-000000000002', 12, 3, 187, 50000),
  ('11111111-0000-0000-0000-000000000002', 16, 3, 155, 50000),
  -- Serengeti
  ('11111111-0000-0000-0000-000000000003', 4, 3, 169, 50000),
  ('11111111-0000-0000-0000-000000000003', 11, 3, 201, 50000),
  -- Fancourt
  ('11111111-0000-0000-0000-000000000004', 6, 3, 183, 50000),
  ('11111111-0000-0000-0000-000000000004', 13, 3, 158, 50000),
  ('11111111-0000-0000-0000-000000000004', 17, 3, 212, 50000),
  -- Pearl Valley
  ('11111111-0000-0000-0000-000000000005', 2, 3, 145, 50000),
  ('11111111-0000-0000-0000-000000000005', 9, 3, 176, 50000),
  ('11111111-0000-0000-0000-000000000005', 15, 3, 191, 50000),
  -- Steenberg
  ('11111111-0000-0000-0000-000000000006', 6, 3, 167, 50000),
  ('11111111-0000-0000-0000-000000000006', 14, 3, 152, 50000),
  -- Zimbali
  ('11111111-0000-0000-0000-000000000007', 3, 3, 188, 50000),
  ('11111111-0000-0000-0000-000000000007', 8, 3, 172, 50000),
  ('11111111-0000-0000-0000-000000000007', 17, 3, 204, 50000),
  -- Sun City
  ('11111111-0000-0000-0000-000000000008', 7, 3, 160, 50000),
  ('11111111-0000-0000-0000-000000000008', 15, 3, 193, 50000),
  -- Leopard Creek
  ('11111111-0000-0000-0000-000000000009', 4, 3, 175, 50000),
  ('11111111-0000-0000-0000-000000000009', 11, 3, 188, 50000),
  ('11111111-0000-0000-0000-000000000009', 16, 3, 162, 50000),
  -- Erinvale
  ('11111111-0000-0000-0000-000000000010', 5, 3, 144, 50000),
  ('11111111-0000-0000-0000-000000000010', 12, 3, 179, 50000)
on conflict (course_id, hole_number) do nothing;
