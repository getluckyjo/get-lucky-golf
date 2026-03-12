'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import BottomTabBar from '@/components/layout/BottomTabBar'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

interface BetRecord {
  id: string
  tier: string
  stake_pence: number
  potential_win_pence: number
  status: string
  declared_result: string | null
  created_at: string
  courses: { id: string; name: string; location_text: string | null; region: string | null } | null
  holes: { id: string; hole_number: number; par: number; distance_metres: number | null } | null
}

function getInitials(name: string | null | undefined, email: string | null | undefined) {
  if (name) return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
  if (email) return email[0].toUpperCase()
  return 'GL'
}

function formatRelativeDate(iso: string) {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diff = now - then
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })
}

function formatStake(cents: number) {
  return `R${(cents / 100).toLocaleString('en-ZA')}`
}

function getStatusBadge(bet: BetRecord) {
  if (bet.status === 'paid' || bet.status === 'verified') return { label: 'Won!', bg: 'rgba(74,157,91,0.12)', color: '#2d6a3f' }
  if (bet.declared_result === 'win' || bet.status === 'claimed') return { label: 'Claimed', bg: 'rgba(201,168,76,0.15)', color: '#a07820' }
  return { label: 'Miss', bg: '#f5f0e8', color: '#999' }
}

export default function HomePage() {
  const router = useRouter()
  const { user, profile, signOut, refreshProfile, loading: authLoading } = useAuth()
  const [bets, setBets] = useState<BetRecord[]>([])
  const [betsLoading, setBetsLoading] = useState(true)
  const [showProfile, setShowProfile] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editName, setEditName] = useState('')
  const [editHandicap, setEditHandicap] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const displayName = profile?.name ?? user?.user_metadata?.full_name ?? null
  const initials = getInitials(displayName, user?.email)
  const firstName = displayName?.split(' ')[0] ?? null

  useEffect(() => {
    fetch('/api/bets')
      .then(r => r.json())
      .then(data => {
        if (data.bets) setBets(data.bets)
      })
      .catch(() => {})
      .finally(() => setBetsLoading(false))
  }, [])

  // Compute stats from real bets
  const totalAttempts = profile?.total_attempts ?? bets.length
  const uniqueCourses = new Set(bets.map(b => b.courses?.id).filter(Boolean)).size
  const totalWon = bets
    .filter(b => b.status === 'paid' || b.status === 'verified')
    .reduce((sum, b) => sum + b.potential_win_pence, 0)
  const wonDisplay = totalWon === 0 ? 'R0' : `R${(totalWon / 100).toLocaleString('en-ZA')}`

  return (
    <PhoneFrame statusTheme="dark">
      <div className="screen-home">
        {/* Header */}
        <div className="home-header">
          <div className="home-greeting">
            Ready to get Lucky?
          </div>
          <button
            className="home-avatar"
            onClick={() => setShowProfile(true)}
            title="Profile"
            style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0 }}
          >
            {initials}
          </button>
        </div>

        {/* Hero play card */}
        <div className="home-hero-card">
          <div className="home-hero-title">One Shot.<br />R1 Million.</div>
          <div className="home-hero-sub">Select a course and back yourself on any par-3</div>
          <button
            className="btn-gold"
            onClick={() => router.push('/select-course')}
            style={{
              width: 'auto',
              alignSelf: 'flex-start',
              padding: 'clamp(14px, 3.5vw, 18px) clamp(28px, 7vw, 40px)',
              fontSize: 'var(--text-md)',
              fontWeight: 700,
              borderRadius: 'var(--radius-md)',
            }}
          >
            Play Now →
          </button>
        </div>

        {/* Pending claim alert */}
        {(() => {
          const activeClaim = bets.find(b => b.status === 'claimed' || (b.declared_result === 'win' && b.status !== 'paid' && b.status !== 'verified'))
          if (!activeClaim || betsLoading) return null
          return (
            <div
              onClick={() => router.push('/verify')}
              style={{
                margin: '0 var(--page-px) var(--space-md)',
                padding: 'var(--space-md) var(--space-md)',
                background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.06))',
                border: '1.5px solid rgba(201,168,76,0.4)',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 'var(--text-2xl)', flexShrink: 0 }}>🏆</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-body)', fontWeight: 700, color: '#8a6a10', marginBottom: 2 }}>
                  Claim Under Review
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: '#a07820' }}>
                  {activeClaim.courses?.name ?? 'Your hole-in-one'} · Tap to check status
                </div>
              </div>
              <span style={{ fontSize: 'var(--text-md)', color: '#a07820' }}>→</span>
            </div>
          )
        })()}

        {/* Stats */}
        <div style={{ display: 'flex', gap: 'var(--space-sm)', padding: '0 var(--page-px)', marginBottom: 'var(--space-lg)' }}>
          {authLoading ? (
            [0, 1, 2].map(i => (
              <div key={i} style={{ flex: 1, background: 'white', borderRadius: 'var(--radius-md)', padding: 'var(--space-md) var(--space-sm)', border: '1px solid #e8e4dc', textAlign: 'center' as const }}>
                <div className="skeleton" style={{ height: 26, width: '60%', margin: '0 auto 8px', borderRadius: 4 }} />
                <div className="skeleton" style={{ height: 11, width: '50%', margin: '0 auto', borderRadius: 4 }} />
              </div>
            ))
          ) : (
            [
              { value: String(totalAttempts || 0), label: 'Attempts' },
              { value: String(uniqueCourses || 0), label: 'Courses' },
              { value: wonDisplay, label: 'Won' },
            ].map(stat => (
              <div
                key={stat.label}
                style={{
                  flex: 1, background: 'white', borderRadius: 14, padding: '14px 12px',
                  textAlign: 'center', border: '1px solid #e8e4dc',
                }}
              >
                <div style={{ fontFamily: 'Poster Gothic, sans-serif', fontSize: 'var(--text-xl)', fontWeight: 900, color: 'var(--green-deep)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-light)', marginTop: 2 }}>{stat.label}</div>
              </div>
            ))
          )}
        </div>

        {/* Recent bets */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--page-px)', marginBottom: 'var(--space-sm)' }}>
          <div className="home-section-title" style={{ padding: 0, margin: 0 }}>Recent Attempts</div>
          {bets.length > 0 && (
            <button
              onClick={() => router.push('/history')}
              style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--green-mid)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              See all →
            </button>
          )}
        </div>
        <div style={{ paddingLeft: 'var(--page-px)', paddingRight: 'var(--page-px)', paddingBottom: 'var(--tab-bar-pb)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {betsLoading ? (
            <>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', padding: 'var(--space-md)', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid #e8e4dc' }}>
                  <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8, borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 11, width: '40%', borderRadius: 4 }} />
                  </div>
                  <div className="skeleton" style={{ height: 22, width: 40, borderRadius: 6, flexShrink: 0 }} />
                </div>
              ))}
            </>
          ) : bets.length === 0 ? (
            <div style={{
              padding: 'var(--space-xl) var(--space-lg)', textAlign: 'center', background: 'white',
              borderRadius: 'var(--radius-md)', border: '1px solid #e8e4dc',
            }}>
              <div style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-xs)' }}>🏌️</div>
              <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--green-deep)', marginBottom: 4 }}>
                No attempts yet
              </div>
              <div style={{ fontSize: 'var(--text-body)', color: 'var(--gray-light)' }}>
                Select a course and take your first shot!
              </div>
            </div>
          ) : (
            bets.map(bet => {
              const badge = getStatusBadge(bet)
              return (
                <div
                  key={bet.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: 14,
                    background: 'white', borderRadius: 14, border: '1px solid #e8e4dc',
                  }}
                >
                  <div style={{
                    width: 'clamp(36px, 10vw, 40px)', height: 'clamp(36px, 10vw, 40px)', background: 'linear-gradient(135deg, #a8d4a0, #4aad62)',
                    borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)',
                    flexShrink: 0,
                  }}>
                    ⛳
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--black)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {bet.courses?.name ?? 'Unknown Course'}
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-light)' }}>
                      Hole {bet.holes?.hole_number ?? '?'} · {formatStake(bet.stake_pence)} stake · {formatRelativeDate(bet.created_at)}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 'var(--text-xs)', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-sm)',
                    background: badge.bg, color: badge.color, flexShrink: 0,
                  }}>
                    {badge.label}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Bottom tab bar */}
      <BottomTabBar active="home" />

      {/* Toast notification */}
      {toast && (
        <div className="toast gold" style={{ bottom: 'calc(var(--tab-bar-h) + 10px)', zIndex: 200 }}>
          {toast}
        </div>
      )}

      {/* Profile sheet overlay */}
      {showProfile && (
        <div
          style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'flex-end', zIndex: 100, borderRadius: 'inherit',
          }}
          onClick={() => { setShowProfile(false); setEditMode(false) }}
        >
          <div
            style={{
              width: '100%', background: 'white', borderRadius: '20px 20px 0 0',
              padding: 'var(--page-px) var(--page-px) var(--space-2xl)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div style={{
              width: 40, height: 4, background: '#e0dbd0', borderRadius: 2,
              margin: '0 auto var(--space-lg)',
            }} />

            {editMode ? (
              /* Edit mode */
              <>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--green-deep)', marginBottom: 'var(--space-lg)' }}>
                  Edit Profile
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <div>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--gray-light)', display: 'block', marginBottom: 6 }}>
                      Full Name
                    </label>
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      placeholder="Your name"
                      style={{
                        width: '100%', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid #e0dbd0', fontSize: 'var(--text-body)', outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--gray-light)', display: 'block', marginBottom: 6 }}>
                      Handicap
                    </label>
                    <input
                      type="number"
                      value={editHandicap}
                      onChange={e => setEditHandicap(e.target.value)}
                      placeholder="e.g. 18"
                      min={0}
                      max={54}
                      style={{
                        width: '100%', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-sm)',
                        border: '1.5px solid #e0dbd0', fontSize: 'var(--text-body)', outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-lg)' }}>
                  <button
                    onClick={() => setEditMode(false)}
                    style={{
                      flex: 1, padding: 'var(--space-md)', background: '#f5f0e8',
                      border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-md)',
                      fontWeight: 600, color: 'var(--gray-mid)', cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={saving}
                    onClick={async () => {
                      if (!user) return
                      setSaving(true)
                      const supabase = createClient()
                      await supabase.from('profiles').upsert({
                        id: user.id,
                        ...(editName.trim() ? { name: editName.trim() } : {}),
                        ...(editHandicap !== '' ? { handicap: parseInt(editHandicap, 10) } : {}),
                      }).catch(() => {})
                      await refreshProfile()
                      setSaving(false)
                      setEditMode(false)
                      setShowProfile(false)
                      showToast('Profile updated ✓')
                    }}
                    style={{
                      flex: 2, padding: 'var(--space-md)',
                      background: 'var(--green-deep)', border: 'none',
                      borderRadius: 'var(--radius-md)', fontSize: 'var(--text-md)', fontWeight: 700,
                      color: 'white', cursor: 'pointer',
                      opacity: saving ? 0.7 : 1,
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </>
            ) : (
              /* View mode */
              <>
                {/* Profile info + edit button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--green-mid), var(--green-deep))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'var(--text-lg)', fontWeight: 700, color: 'white', flexShrink: 0,
                  }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--green-deep)' }}>
                      {displayName ?? 'Golfer'}
                    </div>
                    <div style={{ fontSize: 'var(--text-body)', color: 'var(--gray-light)', marginTop: 2 }}>
                      {user?.email}
                    </div>
                    {profile?.handicap != null && (
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--green-mid)', marginTop: 2, fontWeight: 600 }}>
                        Handicap {profile.handicap}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setEditName(displayName ?? '')
                      setEditHandicap(profile?.handicap != null ? String(profile.handicap) : '')
                      setEditMode(true)
                    }}
                    style={{
                      padding: '7px 14px', background: '#f5f0e8', border: 'none',
                      borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-body)', fontWeight: 600,
                      color: 'var(--green-deep)', cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                </div>

                <div style={{ height: 1, background: '#f0ebe0', marginBottom: 'var(--space-md)' }} />

                {/* Payment method */}
                {profile?.payment_method && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', padding: 'var(--space-sm) 0',
                    borderBottom: '1px solid #f0ebe0', marginBottom: 4,
                  }}>
                    <span style={{ fontSize: 'var(--text-xl)' }}>
                      {profile.payment_method === 'apple_pay' ? '🍎' :
                       profile.payment_method === 'google_pay' ? 'G' :
                       profile.payment_method === 'card' ? '💳' : '🏦'}
                    </span>
                    <div>
                      <div style={{ fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--black)' }}>
                        {profile.payment_method === 'apple_pay' ? 'Apple Pay' :
                         profile.payment_method === 'google_pay' ? 'Google Pay' :
                         profile.payment_method === 'card' ? 'Card' : 'Bank Transfer'}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-light)' }}>Payment method</div>
                    </div>
                  </div>
                )}

                {/* Sign out */}
                <button
                  onClick={async () => {
                    setShowProfile(false)
                    await signOut()
                  }}
                  style={{
                    width: '100%', marginTop: 'var(--space-md)', padding: 'var(--space-md)',
                    background: '#fdf0f0', border: '1px solid #f0d0d0',
                    borderRadius: 'var(--radius-md)', fontSize: 'var(--text-body)', fontWeight: 600,
                    color: '#c0392b', cursor: 'pointer',
                  }}
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </PhoneFrame>
  )
}
