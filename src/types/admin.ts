import type { Database } from './database'

export type BetRow = Database['public']['Tables']['bets']['Row']
export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type CourseRow = Database['public']['Tables']['courses']['Row']
export type HoleRow = Database['public']['Tables']['holes']['Row']
export type VerificationRow = Database['public']['Tables']['verifications']['Row']
export type VerificationStatus = VerificationRow['status']
export type BetStatus = BetRow['status']
export type BetTier = BetRow['tier']

export interface AdminStats {
  totalRevenue: number
  activeBets: number
  pendingClaims: number
  totalPayouts: number
  totalUsers: number
  recentBets: AdminBetRecord[]
  recentVerifications: VerificationQueueItem[]
}

export interface VerificationQueueItem {
  id: string
  betId: string
  status: VerificationStatus
  tier: BetTier
  stakePence: number
  potentialWinPence: number
  videoUrl: string | null
  certificatePath: string | null
  affidavitPath: string | null
  userName: string | null
  userId: string
  courseName: string
  holeNumber: number
  createdAt: string
  declaredAt: string | null
  documentsReceivedAt: string | null
  reviewerNotes: string | null
  reviewedBy: string | null
  verifiedAt: string | null
  payoutInitiatedAt: string | null
}

export interface VerificationDetail extends VerificationQueueItem {
  videoSignedUrl: string | null
  certificateSignedUrl: string | null
  affidavitSignedUrl: string | null
  userBetHistory: AdminBetRecord[]
  userTotalAttempts: number
}

export interface AdminBetRecord {
  id: string
  userId: string
  userName: string | null
  tier: BetTier
  stakePence: number
  potentialWinPence: number
  status: BetStatus
  declaredResult: 'miss' | 'win' | null
  declaredAt: string | null
  videoUrl: string | null
  paymentIntentId: string | null
  courseName: string
  courseId: string
  holeNumber: number
  holeId: string
  createdAt: string
}

export interface AdminUserRecord {
  id: string
  name: string | null
  email: string
  handicap: number | null
  totalAttempts: number
  totalStaked: number
  totalWon: number
  paymentMethod: string | null
  isAdmin: boolean
  suspendedAt: string | null
  suspendedReason: string | null
  createdAt: string
}

export interface AdminCourseRecord extends CourseRow {
  holeCount: number
  activeHoleCount: number
  totalBets: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface BatchActionResult {
  id: string
  success: boolean
  error?: string
}

// Tier display helpers
export const TIER_LABELS: Record<BetTier, string> = {
  tier_1: 'R50 → R25,000',
  tier_2: 'R100 → R60,000',
  tier_3: 'R250 → R200,000',
  tier_4: 'R500 → R500,000',
  tier_5: 'R1,000 → R1,000,000',
}

export const TIER_STAKES: Record<BetTier, number> = {
  tier_1: 5000,
  tier_2: 10000,
  tier_3: 25000,
  tier_4: 50000,
  tier_5: 100000,
}

export const TIER_WINS: Record<BetTier, number> = {
  tier_1: 2500000,
  tier_2: 6000000,
  tier_3: 20000000,
  tier_4: 50000000,
  tier_5: 100000000,
}
