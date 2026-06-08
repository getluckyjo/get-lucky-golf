-- Run this once against PRODUCTION (project: get-lucky-golf / ajsgzeofswlizwwdkesp).
-- Safe to re-run: every statement is idempotent.
--
-- HOW TO RUN: Supabase Dashboard → SQL Editor → paste → Run.
-- Replace the email on the last statement with the address you sign in with.

-- ── Migration 003: age + consent columns ──────────────────────────────
alter table public.profiles
  add column if not exists date_of_birth     date,
  add column if not exists age_verified_at   timestamptz,
  add column if not exists terms_accepted_at timestamptz;

comment on column public.profiles.date_of_birth is
  'Self-declared date of birth, captured at the age gate. Used to enforce 18+.';
comment on column public.profiles.age_verified_at is
  'Set when the user passed the 18+ age gate. NULL = not verified; bet creation is blocked until set.';
comment on column public.profiles.terms_accepted_at is
  'Timestamp the user accepted Terms, Privacy, and Responsible Play at the age gate.';

-- ── Grant admin to yourself (scoped by email) ─────────────────────────
-- 👇 EDIT THIS EMAIL before running.
update public.profiles
   set is_admin = true
 where id = (select id from auth.users where email = 'leroux.johannes@gmail.com');

-- ── Verify ─────────────────────────────────────────────────────────────
select id, name, is_admin, age_verified_at
  from public.profiles
 where is_admin = true;
