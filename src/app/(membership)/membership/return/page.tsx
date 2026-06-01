'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import PhoneFrame from '@/components/layout/PhoneFrame'
import MemberBadge from '@/components/membership/MemberBadge'
import { useAuth } from '@/context/AuthContext'

// PayFast's ITN is asynchronous — after the redirect back we poll the profile
// until membership_status flips to active (webhook processed), then celebrate.
const MAX_POLLS = 12      // ~24s
const POLL_MS = 2000

export default function MembershipReturnPage() {
  const router = useRouter()
  const { profile, refreshProfile } = useAuth()
  const [state, setState] = useState<'processing' | 'success' | 'slow'>('processing')
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    let polls = 0
    let timer: ReturnType<typeof setTimeout>

    async function poll() {
      await refreshProfile()
      polls += 1
      if (profileIsActive()) {
        setState('success')
        return
      }
      if (polls >= MAX_POLLS) {
        setState('slow')
        return
      }
      timer = setTimeout(poll, POLL_MS)
    }

    function profileIsActive(): boolean {
      return profile?.membership_status === 'active'
    }

    poll()
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Catch the case where the profile updates between renders.
  useEffect(() => {
    if (profile?.membership_status === 'active') setState('success')
  }, [profile?.membership_status])

  return (
    <PhoneFrame statusTheme="light">
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        height: '100%', padding: 32, textAlign: 'center',
        background: 'linear-gradient(180deg, #1e3120 0%, var(--green-deep) 100%)', color: 'white',
      }}>
        {state === 'processing' && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.2)', borderTopColor: 'var(--gold)',
              animation: 'spin 0.8s linear infinite', marginBottom: 24,
            }} />
            <h3 style={{ fontFamily: "'Poster Gothic', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              Confirming Your Membership
            </h3>
            <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.5 }}>
              Payment received. Activating your member benefits…
            </p>
          </>
        )}

        {state === 'success' && (
          <>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', background: 'rgba(201,168,76,0.2)',
              border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            }}>
              <Check size={36} strokeWidth={3} color="var(--gold)" />
            </div>
            <MemberBadge style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: "'Poster Gothic', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
              You’re In!
            </h3>
            <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.5, marginBottom: 28, maxWidth: 280 }}>
              Welcome to the Get Lucky Golf Club. Your member status is now active.
            </p>
            <button className="btn-gold" onClick={() => router.replace('/home')} style={{ width: 'auto', padding: '14px 36px' }}>
              Start Playing →
            </button>
          </>
        )}

        {state === 'slow' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 18 }}>⏳</div>
            <h3 style={{ fontFamily: "'Poster Gothic', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
              Almost There
            </h3>
            <p style={{ fontSize: 14, opacity: 0.8, lineHeight: 1.5, marginBottom: 28, maxWidth: 290 }}>
              Your payment went through and we’re finalising your membership. This can take a minute —
              your status will update shortly.
            </p>
            <button className="btn-gold" onClick={() => router.replace('/membership')} style={{ width: 'auto', padding: '14px 32px' }}>
              View Membership
            </button>
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </PhoneFrame>
  )
}
