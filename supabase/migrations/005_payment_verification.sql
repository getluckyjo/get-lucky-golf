-- ----------------------------------------------------------------
-- 005 — Server-side payment verification
--
-- Before this migration, /api/bets/create inserted an 'active' bet from a
-- payment reference supplied by the browser. Nothing confirmed that money had
-- actually moved, so a crafted POST produced a live bet for free.
--
-- This adds a payments ledger that only the PayFast ITN writes to (via the
-- service-role client). Bet creation now requires a matching 'complete' row.
-- The ledger doubles as the payout reconciliation record the launch brief asks
-- for: one row per PayFast transaction, with the amount PayFast reported.
--
-- APPLY THIS BEFORE DEPLOYING THE ACCOMPANYING CODE. Without it, bet creation
-- fails closed (nobody can play) rather than open (free bets) — deliberate, but
-- it is an outage until the table exists.
-- ----------------------------------------------------------------

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),

  -- Our reference, generated at checkout (gl_<tier>_<ts>). Unique so a repeated
  -- ITN for the same transaction updates rather than duplicates.
  m_payment_id text not null unique,

  -- PayFast's own id, for reconciliation against their dashboard.
  pf_payment_id text,

  -- Who and what the payment was for. These come from the signed PayFast
  -- payload (custom_str1..4), not from the browser, so they cannot be forged
  -- without breaking the MD5 signature.
  user_id   uuid references auth.users on delete set null,
  course_id uuid,
  hole_id   uuid,
  tier      bet_tier,

  -- Amount PayFast reported, in cents. Checked against the tier price before
  -- the row is written.
  amount_cents integer not null,

  status text not null default 'complete' check (status in ('complete', 'amount_mismatch')),

  -- The raw ITN payload, for dispute resolution.
  raw_payload jsonb,

  created_at timestamptz not null default now()
);

create index if not exists payments_user_id_idx on public.payments (user_id);
create index if not exists payments_pf_payment_id_idx on public.payments (pf_payment_id);

alter table public.payments enable row level security;

-- Users may read their own payments; nobody may write through the anon/authed
-- key. Writes happen exclusively through the service-role client in the ITN.
drop policy if exists "Users can view their own payments" on public.payments;
create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------
-- Stop one payment producing two bets.
--
-- bets/create already handles error 23505 on payment_intent_id, but no unique
-- constraint existed for it to catch — two concurrent payment-return tabs could
-- each insert an 'active' bet for a single payment. Partial index because
-- payment_intent_id is nullable.
-- ----------------------------------------------------------------
create unique index if not exists bets_payment_intent_id_key
  on public.bets (payment_intent_id)
  where payment_intent_id is not null;
