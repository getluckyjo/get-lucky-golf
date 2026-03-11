'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import BottomTabBar from '@/components/layout/BottomTabBar'
import { useAuth } from '@/context/AuthContext'

type Tab = 'biggest' | 'recent'

interface Winner {
  rank: number
  initials: string
  name: string
  amount: number
  course: string
  stake: number
  date: string
}

const BIGGEST_WINNERS: Winner[] = [
  { rank: 1, initials: 'TM', name: 'Thabo M.', amount: 500000, course: 'Leopard Creek', stake: 500, date: '12 Feb' },
  { rank: 2, initials: 'SR', name: 'Sarah R.', amount: 200000, course: 'Fancourt Estate', stake: 250, date: '28 Jan' },
  { rank: 3, initials: 'JK', name: 'James K.', amount: 200000, course: 'Pearl Valley', stake: 250, date: '3 Feb' },
  { rank: 4, initials: 'AN', name: 'Anika N.', amount: 60000, course: 'Boschenmeer GC', stake: 100, date: '9 Mar' },
  { rank: 5, initials: 'PD', name: 'Pete D.', amount: 60000, course: 'Zimbali CC', stake: 100, date: '1 Mar' },
  { rank: 6, initials: 'LS', name: 'Laura S.', amount: 25000, course: 'Atlantic Beach', stake: 50, date: '7 Mar' },
  { rank: 7, initials: 'MO', name: 'Mike O.', amount: 25000, course: 'Erinvale GC', stake: 50, date: '5 Mar' },
  { rank: 8, initials: 'CB', name: 'Chloe B.', amount: 25000, course: 'Steenberg GC', stake: 50, date: '2 Mar' },
]

const RECENT_WINNERS: Winner[] = [
  { rank: 1, initials: 'AN', name: 'Anika N.', amount: 60000, course: 'Boschenmeer GC', stake: 100, date: 'Today' },
  { rank: 2, initials: 'LS', name: 'Laura S.', amount: 25000, course: 'Atlantic Beach', stake: 50, date: 'Yesterday' },
  { rank: 3, initials: 'MO', name: 'Mike O.', amount: 25000, course: 'Erinvale GC', stake: 50, date: '2 days ago' },
  { rank: 4, initials: 'PD', name: 'Pete D.', amount: 60000, course: 'Zimbali CC', stake: 100, date: '7 days ago' },
  { rank: 5, initials: 'CB', name: 'Chloe B.', amount: 25000, course: 'Steenberg GC', stake: 50, date: '8 days ago' },
  { rank: 6, initials: 'JK', name: 'James K.', amount: 200000, course: 'Pearl Valley', stake: 250, date: '35 days ago' },
  { rank: 7, initials: 'SR', name: 'Sarah R.', amount: 200000, course: 'Fancourt Estate', stake: 250, date: '40 days ago' },
  { rank: 8, initials: 'TM', name: 'Thabo M.', amount: 500000, course: 'Leopard Creek', stake: 500, date: '56 days ago' },
]

function getInitials(name: string | null | undefined, email: string | null | undefined) {
  if (name) return name.split(' ').map((p: string) => p[0]).join('').toUpperCase().slice(0, 2)
  if (email) return email[0].toUpperCase()
  return 'GL'
}

function formatWin(amount: number) {
  return `R${amount.toLocaleString('en-ZA')}`
}

export default function LeaderboardPage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const [tab, setTab] = useState<Tab>('biggest')

  const displayName = profile?.name ?? user?.user_metadata?.full_name ?? null
  const userInitials = getInitials(displayName, user?.email)
  const firstName = displayName?.split(' ')[0] ?? 'You'

  const data = tab === 'biggest' ? BIGGEST_WINNERS : RECENT_WINNERS
  const podium = data.slice(0, 3)
  const rest = data.slice(3)

  const totalPaidOut = BIGGEST_WINNERS.reduce((s, w) => s + w.amount, 0)

  return (
    <PhoneFrame statusTheme="dark">
      <div className="screen-leaderboard">
        {/* Header */}
        <div className="leaderboard-header">
          <div className="leaderboard-title">🏆 Winners</div>
          <div className="leaderboard-subtitle">
            R{totalPaidOut.toLocaleString('en-ZA')} paid out to date
          </div>
        </div>

        {/* Tabs */}
        <div className="leaderboard-tabs">
          <button
            className={`lb-tab${tab === 'biggest' ? ' active' : ''}`}
            onClick={() => setTab('biggest')}
          >
            Biggest Wins
          </button>
          <button
            className={`lb-tab${tab === 'recent' ? ' active' : ''}`}
            onClick={() => setTab('recent')}
          >
            Most Recent
          </button>
        </div>

        {/* List */}
        <div className="leaderboard-list">
          {/* Podium top 3 */}
          <div className="lb-podium">
            {[podium[1], podium[0], podium[2]].map((w, i) => {
              const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3
              return (
                <div key={w.rank} className={`lb-podium-item rank-${actualRank}`}>
                  {actualRank === 1 && <div className="lb-podium-crown">👑</div>}
                  <div className="lb-podium-avatar">{w.initials}</div>
                  <div className="lb-podium-name">{w.name}</div>
                  <div className="lb-podium-amount">{formatWin(w.amount)}</div>
                  <div className="lb-podium-course">{w.course}</div>
                </div>
              )
            })}
          </div>

          {/* Your position (if signed in) */}
          {user && (
            <div className="lb-you-banner">
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--green-mid), var(--green-deep))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0,
              }}>
                {userInitials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green-deep)' }}>
                  {firstName} (You)
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray-light)', marginTop: 1 }}>
                  Play your first round to appear on the leaderboard!
                </div>
              </div>
              <button
                onClick={() => router.push('/select-course')}
                style={{
                  padding: '7px 12px', background: 'var(--green-deep)',
                  border: 'none', borderRadius: 8, color: 'white',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
                }}
              >
                Play →
              </button>
            </div>
          )}

          {/* Rest of leaderboard */}
          {rest.map(w => (
            <div key={w.rank} className="lb-row">
              <div className="lb-rank-num">{w.rank}</div>
              <div className="lb-row-avatar">{w.initials}</div>
              <div className="lb-row-info">
                <div className="lb-row-name">{w.name}</div>
                <div className="lb-row-sub">{w.course} · {w.date}</div>
              </div>
              <div className="lb-row-amount">{formatWin(w.amount)}</div>
            </div>
          ))}

          {/* Footer note */}
          <div style={{
            textAlign: 'center', padding: '4px 0 8px',
            fontSize: 11, color: 'var(--gray-light)',
          }}>
            All prizes independently verified · Updated daily
          </div>
        </div>
      </div>

      {/* Bottom tab bar */}
      <BottomTabBar active="leaderboard" />
    </PhoneFrame>
  )
}
