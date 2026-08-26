/**
 * Payment verification — the single definition of "does this money match this tier".
 *
 * Used by the PayFast ITN (before writing the payments ledger) and by
 * /api/bets/create (before granting a bet). Keeping one implementation means the
 * two cannot drift: a bet is only ever granted for an amount the ITN accepted.
 */
import { BET_TIERS, type BetTier } from '@/lib/tiers'

export type AmountCheck =
  | { ok: true;  tier: BetTier; expectedCents: number }
  | { ok: false; reason: 'unknown_tier' | 'amount_mismatch'; expectedCents: number | null }

/** Expected stake for a tier, in cents. Null when the tier is not one we sell. */
export function expectedStakeCents(tier: string): number | null {
  const t = BET_TIERS.find(x => x.tier === tier)
  return t ? t.stakeZAR * 100 : null
}

/**
 * PayFast reports amounts as a decimal string ("50.00"). Compare in integer
 * cents — floating point on money is how you end up 1c out and rejecting real
 * payments.
 */
export function parseAmountToCents(amountGross: string | number | null | undefined): number {
  const n = typeof amountGross === 'number' ? amountGross : parseFloat(String(amountGross ?? '0'))
  return Number.isFinite(n) ? Math.round(n * 100) : NaN
}

/** Does the amount actually paid match the tier the checkout was signed for? */
export function verifyPaymentAmount(tier: string, amountCents: number): AmountCheck {
  const expectedCents = expectedStakeCents(tier)
  if (expectedCents === null) return { ok: false, reason: 'unknown_tier', expectedCents: null }
  if (!Number.isFinite(amountCents) || amountCents !== expectedCents) {
    return { ok: false, reason: 'amount_mismatch', expectedCents }
  }
  return { ok: true, tier: tier as BetTier, expectedCents }
}
