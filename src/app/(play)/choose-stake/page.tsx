'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useBet, BET_TIERS, BetTier } from '@/context/BetContext'
import { useAuth } from '@/context/AuthContext'

type LoadingStep = 'idle' | 'opening'

export default function ChooseStakePage() {
  const router = useRouter()
  const { selectedCourse, selectedHole, selectTier } = useBet()
  const { user, profile } = useAuth()
  const [selected, setSelected]     = useState<BetTier>('tier_2')
  const [confirming, setConfirming] = useState(false)
  const [step, setStep]             = useState<LoadingStep>('idle')
  const [errorMsg, setErrorMsg]     = useState('')

  const loading = step !== 'idle'
  const activeTier = BET_TIERS.find(t => t.tier === selected)

  // Guard: if no course selected, send back to select-course
  useEffect(() => {
    if (!selectedCourse || !selectedHole) {
      router.replace('/select-course')
    }
  }, [selectedCourse, selectedHole, router])

  const subtitle = selectedCourse
    ? `${selectedCourse.name} · Hole ${selectedHole?.holeNumber} · Par ${selectedHole?.par ?? 3} · ${selectedHole?.distanceMetres}m`
    : 'Select your stake to play'

  function handleSelectTier(tier: BetTier) {
    setSelected(tier)
    setErrorMsg('')
    setConfirming(true)
  }

  async function handleConfirmPayment() {
    setStep('opening')
    setErrorMsg('')
    selectTier(selected)

    try {
      // ── 1. Get signed form fields from our server ─────────────────────────
      const pfRes = await fetch('/api/payments/payfast', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: selected,
          userName: profile?.name ?? user?.user_metadata?.full_name ?? '',
        }),
      })
      const pfData = await pfRes.json()

      if (!pfRes.ok || !pfData?.redirectUrl || !pfData?.formFields) {
        throw new Error(pfData?.error ?? 'Failed to initialise payment')
      }

      // ── 2. Save session data to localStorage (survives redirect) ──────────
      // When the user returns from PayFast, the React context is gone.
      // The payment-return page reads this to create the bet + restore context.
      localStorage.setItem('pf_pending', JSON.stringify({
        m_payment_id: pfData.m_payment_id,
        tier: selected,
        courseId:      selectedCourse?.id,
        holeId:       selectedHole?.id,
        course:       selectedCourse,
        hole:         selectedHole,
      }))

      // ── 3. Build hidden form and submit → redirect to PayFast ─────────────
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = pfData.redirectUrl

      for (const [key, value] of Object.entries(pfData.formFields)) {
        const input = document.createElement('input')
        input.type  = 'hidden'
        input.name  = key
        input.value = String(value)
        form.appendChild(input)
      }

      document.body.appendChild(form)
      form.submit() // User leaves the app → PayFast hosted checkout

    } catch (err: unknown) {
      console.error('[PayFast] handleConfirm error:', err)
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setErrorMsg(msg)
      setStep('idle')
    }
  }

  return (
    <PhoneFrame statusTheme="light">
      <div className="screen-bet">
        <div style={{ position: 'absolute', top: 60, left: 'var(--page-px)', zIndex: 10 }}>
          <button
            onClick={() => !loading && router.back()}
            disabled={loading}
            style={{
              width: 36, height: 36, background: 'rgba(255,255,255,0.1)',
              border: 'none', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: 'var(--text-lg)',
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1,
            }}
          >
            ←
          </button>
        </div>
        <div className="bet-header" style={{ paddingTop: 60 }}>
          <h3 className="bet-title">Back Yourself</h3>
          <p className="bet-subtitle">{subtitle}</p>
        </div>
        {/* Trust banner */}
        <div style={{
          margin: '0 var(--page-px) var(--space-sm)',
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
        }}>
          {/* PayFast */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="16" height="18" viewBox="0 0 14 16" fill="none" style={{ color: 'var(--gold)', flexShrink: 0 }}>
              <rect x="1" y="7" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M4 7V5a3 3 0 1 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>PayFast</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', lineHeight: 1.2 }}>Secure payments</div>
            </div>
          </div>

          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.12)' }} />

          {/* Indwe */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--gold)', flexShrink: 0 }}>
              <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" opacity="0.2"/>
              <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Indwe Insurance</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', lineHeight: 1.2 }}>Prizes fully insured (FSP 3425)</div>
            </div>
          </div>
        </div>

        <div className="bet-options">
          {BET_TIERS.map(tier => (
            <div
              key={tier.tier}
              className={`bet-card${selected === tier.tier ? ' selected' : ''}${tier.isPopular ? ' popular' : ''}`}
              onClick={() => !loading && handleSelectTier(tier.tier)}
              style={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}
            >
              {tier.isPopular && <div className="bet-popular-tag">Most Popular</div>}
              <div className="bet-stake">
                <div className="bet-stake-amount">R{tier.stakeZAR.toLocaleString('en-ZA')}</div>
                <div className="bet-stake-label">Stake</div>
              </div>
              <div className="bet-arrow">→</div>
              <div className="bet-multiplier">{tier.multiplier}×</div>
              <div className="bet-win">
                <div className="bet-win-label">Win</div>
                <div className="bet-win-amount">{tier.winZAR >= 1_000_000 ? 'R1 Mil' : tier.winZAR >= 1_000 ? `R${Math.round(tier.winZAR / 1000)}K` : `R${tier.winZAR}`}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="bet-footer">
          {errorMsg && (
            <div style={{ fontSize: 'var(--text-sm)', color: '#ff6b6b', marginBottom: 'var(--space-xs)', textAlign: 'center' }}>
              Payment failed. Tap a stake to try again.
            </div>
          )}
        </div>

        {/* ── Confirmation overlay ─────────────────────────────────── */}
        {confirming && activeTier && (
          <>
            <div
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                zIndex: 900, transition: 'opacity 0.2s',
              }}
              onClick={() => !loading && setConfirming(false)}
            />
            <div
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: '#fff', borderRadius: '20px 20px 0 0',
                padding: '28px 24px max(env(safe-area-inset-bottom, 16px), 24px)',
                zIndex: 901, maxWidth: 500, margin: '0 auto',
                boxShadow: '0 -4px 30px rgba(0,0,0,0.15)',
              }}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', color: 'var(--green-800)', margin: '0 0 20px', textAlign: 'center' }}>
                Confirm Your Entry
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: '#666' }}>
                  <span>Course</span>
                  <span style={{ color: '#222', fontWeight: 600 }}>{selectedCourse?.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: '#666' }}>
                  <span>Hole</span>
                  <span style={{ color: '#222', fontWeight: 600 }}>Hole {selectedHole?.holeNumber} · Par {selectedHole?.par ?? 3}</span>
                </div>
                <div style={{ height: 1, background: '#eee' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: '#666' }}>
                  <span>Entry stake</span>
                  <span style={{ color: '#222', fontWeight: 600 }}>R{activeTier.stakeZAR.toLocaleString('en-ZA')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: '#666' }}>
                  <span>Potential win</span>
                  <span style={{ color: 'var(--green-700)', fontWeight: 700, fontSize: 'var(--text-base)' }}>
                    R{activeTier.winZAR.toLocaleString('en-ZA')}
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div style={{ fontSize: 'var(--text-sm)', color: '#ff6b6b', marginBottom: 12, textAlign: 'center' }}>
                  {errorMsg}
                </div>
              )}

              <button
                className="btn-gold"
                onClick={handleConfirmPayment}
                disabled={loading}
                style={{ width: '100%', padding: '16px', fontSize: 'var(--text-base)', fontWeight: 700, opacity: loading ? 0.8 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" style={{ flexShrink: 0 }}>
                  <rect x="1" y="7" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M4 7V5a3 3 0 1 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </svg>
                {loading ? 'Redirecting to payment...' : `Pay R${activeTier.stakeZAR.toLocaleString('en-ZA')} & Play`}
              </button>

              {/* Trust signals */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                marginTop: 14, paddingTop: 14, borderTop: '1px solid #f0ebe0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: '#4a9d5b' }}>
                    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" opacity="0.15"/>
                    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#4a9d5b' }}>Secure checkout</span>
                </div>
                <div style={{ width: 1, height: 14, background: '#e0dbd0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: '#2d6a3f' }}>
                    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="currentColor" opacity="0.15"/>
                    <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#2d6a3f' }}>Insured by Indwe</span>
                </div>
              </div>

              <div style={{ fontSize: 10, color: '#aaa', textAlign: 'center', marginTop: 10 }}>
                Secure payment via PayFast · Prizes fully insured (FSP 3425)
                <br />
                <span
                  onClick={() => router.push('/terms')}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Terms &amp; Conditions
                </span>
                {' · '}
                <span
                  onClick={() => router.push('/privacy')}
                  style={{ textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Privacy Policy
                </span>
              </div>

              {!loading && (
                <button
                  onClick={() => setConfirming(false)}
                  style={{
                    width: '100%', padding: '10px', marginTop: 8,
                    background: 'none', border: 'none', color: '#999',
                    fontSize: 'var(--text-sm)', cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </PhoneFrame>
  )
}
