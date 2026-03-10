'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export interface Course {
  id: string
  name: string
  location: string
  region: string
  emoji: string
}

export interface Hole {
  id: string
  courseId: string
  holeNumber: number
  par: number
  distanceMetres: number
}

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

interface BetSession {
  selectedCourse: Course | null
  selectedHole: Hole | null
  selectedTier: BetTier | null
  paymentIntentId: string | null
  betId: string | null
  videoBlob: Blob | null
  videoUploadPath: string | null
  declaredResult: 'hole_in_one' | 'miss' | null
}

interface BetContextType extends BetSession {
  selectCourse: (course: Course, hole: Hole) => void
  selectTier: (tier: BetTier) => void
  confirmPayment: (intentId: string) => void
  setBetId: (id: string) => void
  setVideoBlob: (blob: Blob) => void
  setVideoUploadPath: (path: string) => void
  declareResult: (result: 'hole_in_one' | 'miss') => void
  resetSession: () => void
}

const defaultSession: BetSession = {
  selectedCourse: null,
  selectedHole: null,
  selectedTier: null,
  paymentIntentId: null,
  betId: null,
  videoBlob: null,
  videoUploadPath: null,
  declaredResult: null,
}

const BetContext = createContext<BetContextType | null>(null)

export function BetProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<BetSession>(defaultSession)

  function selectCourse(course: Course, hole: Hole) {
    setSession(s => ({ ...s, selectedCourse: course, selectedHole: hole }))
  }
  function selectTier(tier: BetTier) {
    setSession(s => ({ ...s, selectedTier: tier }))
  }
  function confirmPayment(intentId: string) {
    setSession(s => ({ ...s, paymentIntentId: intentId }))
  }
  function setBetId(id: string) {
    setSession(s => ({ ...s, betId: id }))
  }
  function setVideoBlob(blob: Blob) {
    setSession(s => ({ ...s, videoBlob: blob }))
  }
  function setVideoUploadPath(path: string) {
    setSession(s => ({ ...s, videoUploadPath: path }))
  }
  function declareResult(result: 'hole_in_one' | 'miss') {
    setSession(s => ({ ...s, declaredResult: result }))
  }
  function resetSession() {
    setSession(defaultSession)
  }

  return (
    <BetContext.Provider
      value={{
        ...session,
        selectCourse,
        selectTier,
        confirmPayment,
        setBetId,
        setVideoBlob,
        setVideoUploadPath,
        declareResult,
        resetSession,
      }}
    >
      {children}
    </BetContext.Provider>
  )
}

export function useBet() {
  const ctx = useContext(BetContext)
  if (!ctx) throw new Error('useBet must be used within BetProvider')
  return ctx
}
