'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import BottomTabBar from '@/components/layout/BottomTabBar'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

function getInitials(name: string | null | undefined, email: string | null | undefined) {
  if (name) return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
  if (email) return email[0].toUpperCase()
  return 'GL'
}

const PAYMENT_METHODS = [
  { id: 'card',       icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex' },
  { id: 'eft',        icon: '🏦', label: 'Instant EFT',         sub: 'Direct from your bank' },
  { id: 'apple_pay',  icon: '🍎', label: 'Apple Pay',           sub: 'Fastest checkout' },
  { id: 'google_pay', icon: 'G',  label: 'Google Pay',          sub: 'Quick tap-and-go' },
]

function paymentLabel(method: string | null) {
  return PAYMENT_METHODS.find(m => m.id === method)?.label ?? 'Not set'
}
function paymentIcon(method: string | null) {
  return PAYMENT_METHODS.find(m => m.id === method)?.icon ?? '💳'
}

export default function AccountPage() {
  const router = useRouter()
  const { user, profile, signOut, refreshProfile, loading } = useAuth()

  // Profile editing
  const [editingProfile, setEditingProfile] = useState(false)
  const [editName, setEditName]             = useState('')
  const [editHandicap, setEditHandicap]     = useState('')
  const [savingProfile, setSavingProfile]   = useState(false)

  // Payment method
  const [showPaymentSheet, setShowPaymentSheet]   = useState(false)
  const [selectedMethod, setSelectedMethod]       = useState<string>('card')
  const [savingPayment, setSavingPayment]         = useState(false)

  // Toast
  const [toast, setToast] = useState<string | null>(null)
  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const displayName = profile?.name ?? user?.user_metadata?.full_name ?? null
  const initials    = getInitials(displayName, user?.email)
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })
    : '—'

  async function saveProfile() {
    if (!user) return
    setSavingProfile(true)
    const supabase = createClient()
    await supabase.from('profiles').upsert({
      id: user.id,
      ...(editName.trim()   ? { name: editName.trim() } : {}),
      ...(editHandicap !== '' ? { handicap: parseInt(editHandicap, 10) } : {}),
    }).catch(() => {})
    await refreshProfile()
    setSavingProfile(false)
    setEditingProfile(false)
    showToast('Profile updated ✓')
  }

  async function savePaymentMethod() {
    if (!user) return
    setSavingPayment(true)
    const supabase = createClient()
    await supabase.from('profiles').upsert({
      id: user.id,
      payment_method: selectedMethod,
      payment_setup_done: true,
    }).catch(() => {})
    await refreshProfile()
    setSavingPayment(false)
    setShowPaymentSheet(false)
    showToast('Payment method updated ✓')
  }

  return (
    <PhoneFrame statusTheme="dark">

      {/* ── Scrollable body ── */}
      <div style={{ overflowY: 'auto', height: '100%', background: 'var(--cream)' }}>

        {/* Header */}
        <div style={{ padding: '60px 24px 0' }}>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 26, fontWeight: 900, color: 'var(--green-deep)',
            marginBottom: 4,
          }}>
            My Account
          </div>
          <div style={{ fontSize: 13, color: 'var(--gray-light)', marginBottom: 24 }}>
            Manage your profile &amp; preferences
          </div>
        </div>

        {/* ── Identity card ── */}
        <div style={{ padding: '0 24px', marginBottom: 20 }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--green-deep) 0%, #2d6a3f 100%)',
            borderRadius: 20, padding: '28px 24px',
            display: 'flex', alignItems: 'center', gap: 18,
          }}>
            {loading ? (
              <div className="skeleton" style={{ width: 72, height: 72, borderRadius: '50%', flexShrink: 0, opacity: 0.3 }} />
            ) : (
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                border: '2.5px solid rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, fontWeight: 800, color: 'white', flexShrink: 0,
                fontFamily: 'Playfair Display, serif',
              }}>
                {initials}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              {loading ? (
                <>
                  <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 8, borderRadius: 4 }} />
                  <div className="skeleton" style={{ height: 13, width: '80%', borderRadius: 4 }} />
                </>
              ) : (
                <>
                  <div style={{
                    fontSize: 19, fontWeight: 700, color: 'white',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    fontFamily: 'Playfair Display, serif',
                  }}>
                    {displayName ?? 'Golfer'}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>
                    {user?.email}
                  </div>
                  {profile?.handicap != null && (
                    <div style={{
                      display: 'inline-flex', alignItems: 'center',
                      marginTop: 8, padding: '3px 10px',
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: 20, fontSize: 11, fontWeight: 600,
                      color: 'rgba(255,255,255,0.9)',
                    }}>
                      HCP {profile.handicap}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Profile details ── */}
        <div style={{ padding: '0 24px', marginBottom: 16 }}>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8e4dc', overflow: 'hidden' }}>

            {/* Section header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 18px', borderBottom: '1px solid #f0ebe0',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-deep)' }}>Profile Details</div>
              {!editingProfile && (
                <button
                  onClick={() => {
                    setEditName(displayName ?? '')
                    setEditHandicap(profile?.handicap != null ? String(profile.handicap) : '')
                    setEditingProfile(true)
                  }}
                  style={{
                    padding: '5px 12px', background: '#f5f0e8', border: 'none',
                    borderRadius: 8, fontSize: 12, fontWeight: 600,
                    color: 'var(--green-deep)', cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
              )}
            </div>

            {editingProfile ? (
              /* Edit form */
              <div style={{ padding: 18 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{
                      fontSize: 11, fontWeight: 600, color: 'var(--gray-light)',
                      display: 'block', marginBottom: 6,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>
                      Full Name
                    </label>
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder="Your name"
                      style={{
                        width: '100%', padding: '11px 14px', borderRadius: 10,
                        border: '1.5px solid #d0c9be', fontSize: 15, outline: 'none',
                        boxSizing: 'border-box', background: '#faf8f4',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      fontSize: 11, fontWeight: 600, color: 'var(--gray-light)',
                      display: 'block', marginBottom: 6,
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>
                      Handicap (0 – 54)
                    </label>
                    <input
                      type="number"
                      value={editHandicap}
                      onChange={e => setEditHandicap(e.target.value)}
                      placeholder="e.g. 18"
                      min={0} max={54}
                      style={{
                        width: '100%', padding: '11px 14px', borderRadius: 10,
                        border: '1.5px solid #d0c9be', fontSize: 15, outline: 'none',
                        boxSizing: 'border-box', background: '#faf8f4',
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button
                    onClick={() => setEditingProfile(false)}
                    style={{
                      flex: 1, padding: '12px', background: '#f5f0e8', border: 'none',
                      borderRadius: 10, fontSize: 14, fontWeight: 600,
                      color: '#888', cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={savingProfile}
                    onClick={saveProfile}
                    style={{
                      flex: 2, padding: '12px', background: 'var(--green-deep)',
                      border: 'none', borderRadius: 10, fontSize: 14,
                      fontWeight: 700, color: 'white', cursor: 'pointer',
                      opacity: savingProfile ? 0.7 : 1,
                    }}
                  >
                    {savingProfile ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              /* Read-only rows */
              <>
                {[
                  { label: 'Full Name', value: displayName ?? '—' },
                  { label: 'Email',     value: user?.email ?? '—' },
                  { label: 'Handicap',  value: profile?.handicap != null ? String(profile.handicap) : '—' },
                ].map((row, i, arr) => (
                  <div
                    key={row.label}
                    style={{
                      padding: '14px 18px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      borderBottom: i < arr.length - 1 ? '1px solid #f8f4ee' : 'none',
                    }}
                  >
                    <span style={{ fontSize: 13, color: 'var(--gray-light)' }}>{row.label}</span>
                    {loading ? (
                      <div className="skeleton" style={{ height: 14, width: row.label === 'Email' ? 140 : 80, borderRadius: 4 }} />
                    ) : (
                      <span style={{
                        fontSize: 14, fontWeight: 600, color: 'var(--black)',
                        maxWidth: 190, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {row.value}
                      </span>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* ── Payment method ── */}
        <div style={{ padding: '0 24px', marginBottom: 16 }}>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8e4dc', overflow: 'hidden' }}>

            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0ebe0' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-deep)' }}>Payment Method</div>
            </div>

            <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg, #e8f0e4, #d4e8cc)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, flexShrink: 0,
              }}>
                {paymentIcon(profile?.payment_method ?? null)}
              </div>
              <div style={{ flex: 1 }}>
                {loading ? (
                  <>
                    <div className="skeleton" style={{ height: 15, width: 120, borderRadius: 4, marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 11, width: 90, borderRadius: 4 }} />
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--black)' }}>
                      {paymentLabel(profile?.payment_method ?? null)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--gray-light)', marginTop: 2 }}>
                      Secured by PayFast
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedMethod(profile?.payment_method ?? 'card')
                  setShowPaymentSheet(true)
                }}
                style={{
                  padding: '7px 16px', background: '#f5f0e8', border: 'none',
                  borderRadius: 8, fontSize: 13, fontWeight: 600,
                  color: 'var(--green-deep)', cursor: 'pointer', flexShrink: 0,
                }}
              >
                Change
              </button>
            </div>

            <div style={{
              padding: '10px 18px 14px',
              display: 'flex', alignItems: 'center', gap: 6,
              borderTop: '1px solid #f8f4ee',
            }}>
              <span style={{ fontSize: 12 }}>🔒</span>
              <span style={{ fontSize: 11, color: 'var(--gray-light)' }}>
                256-bit SSL · Card details are never stored by Get Lucky
              </span>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div style={{ padding: '0 24px', marginBottom: 16 }}>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e8e4dc', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #f0ebe0' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-deep)' }}>Your Stats</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#f0ebe0' }}>
              {[
                { label: 'Member Since',    value: memberSince },
                { label: 'Total Attempts',  value: loading ? null : String(profile?.total_attempts ?? 0) },
              ].map(stat => (
                <div key={stat.label} style={{ background: 'white', padding: '18px', textAlign: 'center' }}>
                  {loading || stat.value === null ? (
                    <>
                      <div className="skeleton" style={{ height: 20, width: '65%', margin: '0 auto 6px', borderRadius: 4 }} />
                      <div className="skeleton" style={{ height: 11, width: '50%', margin: '0 auto', borderRadius: 4 }} />
                    </>
                  ) : (
                    <>
                      <div style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: 16, fontWeight: 800, color: 'var(--green-deep)',
                      }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--gray-light)', marginTop: 3 }}>{stat.label}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sign out ── */}
        <div style={{ padding: '0 24px', paddingBottom: 96 }}>
          <button
            onClick={async () => {
              await signOut()
              router.push('/auth')
            }}
            style={{
              width: '100%', padding: '15px',
              background: 'white', border: '1.5px solid #f0d0d0',
              borderRadius: 14, fontSize: 15, fontWeight: 600,
              color: '#c0392b', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Bottom tab bar ── */}
      <BottomTabBar active="account" />

      {/* ── Toast ── */}
      {toast && (
        <div className="toast gold" style={{ bottom: 76, zIndex: 200 }}>
          {toast}
        </div>
      )}

      {/* ── Payment method sheet ── */}
      {showPaymentSheet && (
        <div
          style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'flex-end', zIndex: 100, borderRadius: 'inherit',
          }}
          onClick={() => setShowPaymentSheet(false)}
        >
          <div
            style={{
              width: '100%', background: 'white',
              borderRadius: '20px 20px 0 0', padding: '24px 24px 44px',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div style={{ width: 40, height: 4, background: '#e0dbd0', borderRadius: 2, margin: '0 auto 20px' }} />

            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--green-deep)', marginBottom: 4 }}>
              Change Payment Method
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-light)', marginBottom: 20 }}>
              Powered by PayFast · Secured checkout
            </div>

            {/* Method options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PAYMENT_METHODS.map(method => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', background: 'white', textAlign: 'left',
                    border: `2px solid ${selectedMethod === method.id ? 'var(--green-mid)' : '#e8e4dc'}`,
                    borderRadius: 14, cursor: 'pointer',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <span style={{ fontSize: 22, width: 28, textAlign: 'center', flexShrink: 0 }}>
                    {method.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--black)' }}>{method.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-light)', marginTop: 1 }}>{method.sub}</div>
                  </div>
                  {/* Radio dot */}
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${selectedMethod === method.id ? 'var(--green-mid)' : '#ddd'}`,
                    background: selectedMethod === method.id ? 'var(--green-mid)' : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {selectedMethod === method.id && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              disabled={savingPayment}
              onClick={savePaymentMethod}
              style={{
                width: '100%', marginTop: 20, padding: '15px',
                background: 'var(--green-deep)', border: 'none',
                borderRadius: 14, fontSize: 15, fontWeight: 700,
                color: 'white', cursor: 'pointer',
                opacity: savingPayment ? 0.7 : 1,
              }}
            >
              {savingPayment ? 'Saving…' : 'Save Payment Method'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: 'var(--gray-light)' }}>
              🔒 256-bit SSL · Secured by PayFast
            </div>
          </div>
        </div>
      )}

    </PhoneFrame>
  )
}
