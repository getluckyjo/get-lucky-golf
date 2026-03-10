'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useBet, BET_TIERS } from '@/context/BetContext'

type StepStatus = 'completed' | 'active' | 'pending'

interface VerifyStep {
  id: string
  icon: string
  title: string
  desc: string
  status: StepStatus
}

const INITIAL_STEPS: VerifyStep[] = [
  { id: 'footage', icon: '🎥', title: 'Footage Received', desc: 'Video uploaded successfully', status: 'completed' },
  { id: 'documents', icon: '📄', title: 'Documents Received', desc: 'Certificate & affidavit under review', status: 'active' },
  { id: 'verified', icon: '✅', title: 'Shot Verified', desc: 'Manual review by our team', status: 'pending' },
  { id: 'payout', icon: '💰', title: 'Payout Initiated', desc: 'Funds transferred to your account', status: 'pending' },
]

const STATUS_TO_STEPS: Record<string, number> = {
  pending: 1,
  documents_received: 2,
  under_review: 2,
  approved: 3,
  rejected: 3,
}

function applyProgress(steps: VerifyStep[], activeIndex: number): VerifyStep[] {
  return steps.map((s, i) => ({
    ...s,
    status: i < activeIndex ? 'completed' : i === activeIndex ? 'active' : 'pending',
  }))
}

export default function VerifyPage() {
  const router = useRouter()
  const { selectedTier, betId, resetSession } = useBet()
  const [steps, setSteps] = useState<VerifyStep[]>(INITIAL_STEPS)
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  const tierData = BET_TIERS.find(t => t.tier === selectedTier) ?? BET_TIERS[1]
  const payoutDate = new Date()
  payoutDate.setDate(payoutDate.getDate() + 7)
  const payoutEta = payoutDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  // Simulated progression (fallback / demo)
  useEffect(() => {
    const t1 = setTimeout(() => {
      setSteps(prev => applyProgress(prev, 2))
    }, 5000)
    return () => clearTimeout(t1)
  }, [])

  // Real polling from Supabase (when betId is real)
  useEffect(() => {
    if (!betId || betId.startsWith('bet_mock') || betId.startsWith('bet_fallback')) return

    async function poll() {
      try {
        const res = await fetch(`/api/verifications/${betId}`)
        const { verification } = await res.json()
        if (verification?.status) {
          const activeIndex = STATUS_TO_STEPS[verification.status] ?? 1
          setSteps(prev => applyProgress(prev, activeIndex))
        }
      } catch {
        // Ignore poll errors
      }
    }

    poll()
    pollRef.current = setInterval(poll, 10_000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [betId])

  function handleHome() {
    resetSession()
    router.push('/home')
  }

  return (
    <PhoneFrame statusTheme="dark">
      <div className="screen-verify">
        <div className="verify-animation">
          <div className="verify-ring" />
          <div className="verify-icon">🏌️</div>
        </div>
        <div className="verify-title">Claim Under Review</div>
        <div className="verify-desc">
          Our team is verifying your hole-in-one. You'll receive a notification when it's confirmed.
        </div>
        <div className="verify-timeline">
          {steps.map(step => (
            <div key={step.id} className={`verify-step ${step.status}`}>
              <div className="verify-step-dot">{step.status === 'completed' ? '✓' : step.icon}</div>
              <div className="verify-step-content">
                <h5>{step.title}</h5>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="verify-payout">
          <div className="verify-payout-label">Pending Prize</div>
          <div className="verify-payout-amount">£{tierData.winGBP.toLocaleString()}</div>
          <div className="verify-payout-eta">Expected by {payoutEta}</div>
        </div>
        <div style={{ width: 'calc(100% - 48px)', paddingBottom: 20 }}>
          <button className="btn-share" onClick={handleHome}>
            🏠 Back to Home
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}
