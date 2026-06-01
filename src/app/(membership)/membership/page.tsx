'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import PhoneFrame from '@/components/layout/PhoneFrame'
import BottomTabBar from '@/components/layout/BottomTabBar'
import MemberBadge from '@/components/membership/MemberBadge'
import { useAuth } from '@/context/AuthContext'
import { useMembership } from '@/hooks/useMembership'
import { MEMBERSHIP_PLANS, MEMBERSHIP_PERKS, type MembershipPlan } from '@/lib/membership'

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function MembershipPage() {
  const router = useRouter()
  const { user, profile, refreshProfile } = useAuth()
  const { isMember, isActive, status, plan, startedAt, renewsAt } = useMembership()

  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan>('monthly')
  const [loading, setLoading] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState('')

  async function startCheckout() {
    if (!user) { router.push('/auth'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/payments/payfast/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          userName: profile?.name ?? user?.user_metadata?.full_name ?? '',
        }),
      })
      const data = await res.json()
      if (!res.ok || !data?.redirectUrl || !data?.formFields) {
        throw new Error(data?.error ?? 'Failed to start checkout')
      }

      const form = document.createElement('form')
      form.method = 'POST'
      form.action = data.redirectUrl
      for (const [key, value] of Object.entries(data.formFields)) {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = String(value)
        form.appendChild(input)
      }
      document.body.appendChild(form)
      form.submit() // → PayFast hosted checkout
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  async function cancelMembership() {
    if (!confirm('Cancel your membership? You keep access until your current period ends.')) return
    setCancelling(true)
    setError('')
    try {
      const res = await fetch('/api/payments/membership/cancel', { method: 'POST' })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d?.error ?? 'Could not cancel')
      }
      await refreshProfile()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setCancelling(false)
    }
  }

  const cfg = MEMBERSHIP_PLANS[selectedPlan]

  return (
    <PhoneFrame statusTheme="dark" hideSponsor>
      <div style={{ overflowY: 'auto', height: '100%', background: 'var(--cream)' }}>

        {/* ── Hero ── */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(150deg, #1e3120 0%, var(--green-deep) 55%, #4a7a3d 100%)',
          padding: '56px var(--page-px) var(--space-xl)',
          color: 'white',
        }}>
          <button
            onClick={() => router.back()}
            aria-label="Back"
            style={{
              position: 'absolute', top: 52, left: 'var(--page-px)',
              width: 36, height: 36, background: 'rgba(255,255,255,0.12)',
              border: 'none', borderRadius: 'var(--radius-sm)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>

          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <MemberBadge style={{ marginBottom: 14 }} />
            <h1 style={{
              fontFamily: 'Poster Gothic, sans-serif', fontSize: 'var(--text-2xl)',
              fontWeight: 900, lineHeight: 1.1, marginBottom: 8,
            }}>
              Get Lucky Golf Club
            </h1>
            <p style={{ fontSize: 'var(--text-body)', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
              {isMember
                ? 'Thanks for being a member. Here’s your status & benefits.'
                : 'Join the club for status, perks & a fully-insured shot at glory.'}
            </p>
          </div>
        </div>

        {/* ── Member status (active/cancelled/past_due) ── */}
        {isMember ? (
          <div style={{ padding: 'var(--space-lg) var(--page-px) 0' }}>
            <div style={{
              background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #e8e4dc',
              padding: 'var(--space-lg)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                <div style={{ fontSize: 'var(--text-body)', fontWeight: 700, color: 'var(--green-deep)' }}>
                  Your Membership
                </div>
                <MemberBadge size="sm" />
              </div>
              {[
                { label: 'Status', value: status === 'active' ? 'Active' : status === 'cancelled' ? 'Cancelled (ends soon)' : 'Payment due' },
                { label: 'Plan', value: plan ? MEMBERSHIP_PLANS[plan].label : '—' },
                { label: 'Member since', value: formatDate(startedAt) },
                { label: status === 'cancelled' ? 'Access until' : 'Renews', value: formatDate(renewsAt) },
              ].map((row, i, arr) => (
                <div key={row.label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: 'var(--space-sm) 0',
                  borderBottom: i < arr.length - 1 ? '1px solid #f5f0e8' : 'none',
                }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-light)' }}>{row.label}</span>
                  <span style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--black)' }}>{row.value}</span>
                </div>
              ))}

              {isActive && (
                <button
                  onClick={cancelMembership}
                  disabled={cancelling}
                  style={{
                    width: '100%', marginTop: 'var(--space-md)', padding: 'var(--space-sm)',
                    background: 'white', border: '1.5px solid #f0d0d0', borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)', fontWeight: 600, color: '#c0392b', cursor: 'pointer',
                    opacity: cancelling ? 0.6 : 1,
                  }}
                >
                  {cancelling ? 'Cancelling…' : 'Cancel membership'}
                </button>
              )}
              {status === 'past_due' && (
                <button
                  onClick={startCheckout}
                  disabled={loading}
                  className="btn-gold"
                  style={{ width: '100%', marginTop: 'var(--space-md)', padding: 'var(--space-sm)', fontWeight: 700 }}
                >
                  {loading ? 'Redirecting…' : 'Update payment'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── Plan selector ── */
          <div style={{ padding: 'var(--space-lg) var(--page-px) 0' }}>
            <div style={{ display: 'flex', gap: 10 }}>
              {(['monthly', 'annual'] as MembershipPlan[]).map(p => {
                const pc = MEMBERSHIP_PLANS[p]
                const active = selectedPlan === p
                return (
                  <button
                    key={p}
                    onClick={() => setSelectedPlan(p)}
                    style={{
                      flex: 1, textAlign: 'left', cursor: 'pointer',
                      background: 'white',
                      border: active ? '2px solid var(--gold)' : '1.5px solid #e8e4dc',
                      borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)',
                      position: 'relative',
                    }}
                  >
                    {p === 'annual' && (
                      <span style={{
                        position: 'absolute', top: -9, right: 10, background: 'var(--gold)',
                        color: '#3a2f12', fontSize: 9, fontWeight: 800, padding: '2px 8px',
                        borderRadius: 10, letterSpacing: '0.03em',
                      }}>
                        BEST VALUE
                      </span>
                    )}
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--green-deep)' }}>{pc.label}</div>
                    <div style={{ fontFamily: 'Poster Gothic, sans-serif', fontSize: 'var(--text-xl)', fontWeight: 900, color: 'var(--green-deep)', marginTop: 2 }}>
                      R{pc.priceZAR.toLocaleString('en-ZA')}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-light)' }}>{pc.cadence}</div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Perks ── */}
        <div style={{ padding: 'var(--space-lg) var(--page-px) 0' }}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #e8e4dc', padding: 'var(--space-lg)' }}>
            <div style={{ fontSize: 'var(--text-body)', fontWeight: 700, color: 'var(--green-deep)', marginBottom: 'var(--space-md)' }}>
              Member Benefits
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
              {MEMBERSHIP_PERKS.map(perk => (
                <div key={perk} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{
                    flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
                    background: 'rgba(74,122,61,0.12)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', marginTop: 1,
                  }}>
                    <Check size={13} strokeWidth={3} color="var(--green-mid)" />
                  </span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--black)', lineHeight: 1.4 }}>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ padding: '12px var(--page-px) 0', color: '#c0392b', fontSize: 'var(--text-sm)', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* ── Sticky CTA (join) ── */}
        {!isMember && (
          <div style={{ padding: 'var(--space-lg) var(--page-px) var(--tab-bar-pb)' }}>
            <button
              onClick={startCheckout}
              disabled={loading}
              className="btn-gold"
              style={{ width: '100%', padding: '16px', fontSize: 'var(--text-base)', fontWeight: 700, opacity: loading ? 0.8 : 1 }}
            >
              {loading ? 'Redirecting to payment…' : `Join for R${cfg.priceZAR.toLocaleString('en-ZA')} ${cfg.cadence}`}
            </button>
            <p style={{ fontSize: 10, color: 'var(--gray-light)', textAlign: 'center', marginTop: 10, lineHeight: 1.5 }}>
              Cancel anytime, no lock-in · Secure recurring payment via PayFast
              <br />
              Prizes fully insured (FSP 3425)
            </p>
          </div>
        )}

        {isMember && <div style={{ height: 'var(--tab-bar-pb)' }} />}
      </div>

      <BottomTabBar active="membership" />
    </PhoneFrame>
  )
}
