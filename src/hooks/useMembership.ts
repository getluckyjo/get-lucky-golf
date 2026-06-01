'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import type { MembershipPlan } from '@/lib/membership'

export type MembershipStatus = 'none' | 'active' | 'past_due' | 'cancelled'

export interface MembershipState {
  /** True while the member still has access (active OR cancelled-but-not-yet-expired). */
  isMember: boolean
  status: MembershipStatus
  plan: MembershipPlan | null
  startedAt: string | null
  renewsAt: string | null
  /** True only for status === 'active' (billing on, not cancelled/past_due). */
  isActive: boolean
}

/**
 * Reads membership state from the authenticated profile. Membership is the
 * server's source of truth (written only by the PayFast ITN webhook); this
 * hook just surfaces it. A `cancelled` member keeps access until renews_at.
 */
export function useMembership(): MembershipState {
  const { profile } = useAuth()

  const status = (profile?.membership_status ?? 'none') as MembershipStatus
  const renewsAt = profile?.membership_renews_at ?? null

  // Snapshot "now" once at mount via a lazy initializer so render stays pure
  // (no Date.now() call during render). Only the cancelled-but-not-yet-expired
  // case reads this; active members don't depend on it.
  const [now] = useState(() => Date.now())

  const notExpired = renewsAt ? new Date(renewsAt).getTime() > now : false
  const isActive = status === 'active'
  const isMember = isActive || (status === 'cancelled' && notExpired)

  return {
    isMember,
    isActive,
    status,
    plan: (profile?.membership_plan ?? null) as MembershipPlan | null,
    startedAt: profile?.membership_started_at ?? null,
    renewsAt,
  }
}
