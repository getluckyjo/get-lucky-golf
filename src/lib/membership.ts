// ---------------------------------------------------------------------------
// Get Lucky Golf — Membership display config
//
// Membership is owned and billed by the external funnel
// (membership.getluckygolfclub.com). This app only DISPLAYS plan/pricing as
// marketing and hands signups off to the funnel — it does not bill in-app.
// Prices mirror the funnel: Monthly R149/month, Annual ≈ R1 490/year.
// ⚠️ Confirm the exact annual figure against the funnel before relying on it.
// ---------------------------------------------------------------------------
export type MembershipPlan = 'monthly' | 'annual'

export interface MembershipPlanConfig {
  plan: MembershipPlan
  /** Whole-rand integer for display. */
  priceZAR: number
  label: string
  cadence: string
}

export const MEMBERSHIP_PLANS: Record<MembershipPlan, MembershipPlanConfig> = {
  monthly: { plan: 'monthly', priceZAR: 149,  label: 'Monthly', cadence: 'per month' },
  annual:  { plan: 'annual',  priceZAR: 1490, label: 'Annual',  cadence: 'per year' },
}

export function isMembershipPlan(value: unknown): value is MembershipPlan {
  return value === 'monthly' || value === 'annual'
}

/**
 * The external funnel where members actually sign up and are billed.
 * The in-app "Join" CTAs deep-link here.
 */
export const MEMBERSHIP_FUNNEL_URL = 'https://membership.getluckygolfclub.com/join/get-lucky'

/** Perks shown in-app. Marketing copy mirrored from the external funnel. */
export const MEMBERSHIP_PERKS: string[] = [
  'Member badge & “Member since” status on your profile',
  'R100,000 cash prize for every verified hole-in-one',
  'Professionally produced HD video of your shot',
  'Signature Get Lucky golden bag tag',
  'Access to member-only events & privileges',
  'Play across 20+ partner courses nationwide',
  'Insurance-backed prizes (underwritten by Indwe Risk Services)',
]
