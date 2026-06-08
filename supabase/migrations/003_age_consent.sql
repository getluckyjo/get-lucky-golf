-- 003_age_consent.sql
-- Adds age-verification + consent capture to profiles.
-- Required before launch: Get Lucky Golf is an 18+, SA-resident-only,
-- real-money product. The Terms assert this; these columns let us capture
-- and enforce it rather than merely state it.

alter table public.profiles
  add column if not exists date_of_birth     date,
  add column if not exists age_verified_at   timestamptz,
  add column if not exists terms_accepted_at timestamptz;

comment on column public.profiles.date_of_birth is
  'Self-declared date of birth, captured at the age gate. Used to enforce 18+.';
comment on column public.profiles.age_verified_at is
  'Set when the user passed the 18+ age gate. NULL = not yet verified; the money path (bet creation) is blocked until set.';
comment on column public.profiles.terms_accepted_at is
  'Timestamp the user explicitly accepted Terms, Privacy, and Responsible Play at the age gate.';
