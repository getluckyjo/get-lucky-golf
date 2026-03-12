/**
 * Shared tier definitions — importable from both client and server code.
 * (BetContext.tsx re-exports these for backward compatibility.)
 */

export type BetTier = 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4' | 'tier_5'

export interface BetTierData {
  tier: BetTier
  stakeZAR: number
  winZAR: number
  multiplier: number
  label: string
  isPopular: boolean
}

export const BET_TIERS: BetTierData[] = [
  { tier: 'tier_1', stakeZAR: 50,   winZAR: 25000,   multiplier: 500,  label: 'R50 → R25,000',       isPopular: false },
  { tier: 'tier_2', stakeZAR: 100,  winZAR: 60000,   multiplier: 600,  label: 'R100 → R60,000',      isPopular: true  },
  { tier: 'tier_3', stakeZAR: 250,  winZAR: 200000,  multiplier: 800,  label: 'R250 → R200,000',     isPopular: false },
  { tier: 'tier_4', stakeZAR: 500,  winZAR: 500000,  multiplier: 1000, label: 'R500 → R500,000',     isPopular: false },
  { tier: 'tier_5', stakeZAR: 1000, winZAR: 1000000, multiplier: 1000, label: 'R1,000 → R1,000,000', isPopular: false },
]
