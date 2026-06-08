-- 004_tier_6.sql
-- Adds the R150 → R100,000 entry tier ('tier_6') to the bet_tier enum.
-- Idempotent. Run outside a transaction (ALTER TYPE ... ADD VALUE).
alter type public.bet_tier add value if not exists 'tier_6';
