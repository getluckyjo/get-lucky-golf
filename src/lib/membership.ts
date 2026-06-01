// ---------------------------------------------------------------------------
// Get Lucky Golf — Membership plan config (single source of truth)
//
// Prices mirror the external funnel (membership.getluckygolfclub.com):
//   Monthly  R149/month
//   Annual   "Save R298" vs monthly → 12 × R149 − R298 = R1 490/year
//            ⚠️ The external page shows the saving, not a standalone annual
//            price. CONFIRM the exact annual figure before going live.
//
// PayFast `frequency`: 3 = monthly, 6 = annual.
// ---------------------------------------------------------------------------
export type MembershipPlan = 'monthly' | 'annual'

export interface MembershipPlanConfig {
  plan: MembershipPlan
  /** Rand amount, two-decimal string for PayFast (e.g. "149.00"). */
  amount: string
  /** Whole-rand integer for display. */
  priceZAR: number
  /** Cents — stored in the audit table. */
  amountCents: number
  /** PayFast billing frequency code. */
  frequency: 3 | 6
  label: string
  cadence: string
  itemName: string
}

export const MEMBERSHIP_PLANS: Record<MembershipPlan, MembershipPlanConfig> = {
  monthly: {
    plan: 'monthly',
    amount: '149.00',
    priceZAR: 149,
    amountCents: 14900,
    frequency: 3,
    label: 'Monthly',
    cadence: 'per month',
    itemName: 'Get Lucky Golf Club - Monthly Membership',
  },
  annual: {
    plan: 'annual',
    amount: '1490.00',
    priceZAR: 1490,
    amountCents: 149000,
    frequency: 6,
    label: 'Annual',
    cadence: 'per year',
    itemName: 'Get Lucky Golf Club - Annual Membership',
  },
}

export function isMembershipPlan(value: unknown): value is MembershipPlan {
  return value === 'monthly' || value === 'annual'
}

/** Perks shown in-app. Marketing copy mirrored from the external funnel —
 *  membership is cosmetic/status only, it does not change bet pricing. */
export const MEMBERSHIP_PERKS: string[] = [
  'Member badge & “Member since” status on your profile',
  'R100,000 cash prize for every verified hole-in-one',
  'Professionally produced HD video of your shot',
  'Signature Get Lucky golden bag tag',
  'Access to member-only events & privileges',
  'Play across 20+ partner courses nationwide',
  'Insurance-backed prizes (underwritten by Indwe Risk Services)',
]
