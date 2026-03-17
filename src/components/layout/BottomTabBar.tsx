'use client'

import { useRouter } from 'next/navigation'
import SponsorBanner from './SponsorBanner'

type ActiveTab = 'home' | 'history' | 'leaderboard' | 'account'

const TABS = [
  { key: 'home',        icon: '🏠', label: 'Home',    path: '/home' },
  { key: 'history',     icon: '📋', label: 'My Bets', path: '/history' },
  { key: 'leaderboard', icon: '🏆', label: 'Winners', path: '/leaderboard' },
  { key: 'play',        icon: '⛳', label: 'Play',    path: '/select-course' },
  { key: 'account',     icon: '👤', label: 'Account', path: '/account' },
] as const

export default function BottomTabBar({ active }: { active: ActiveTab }) {
  const router = useRouter()

  return (
    <nav className="bottom-tab-bar" aria-label="Main navigation">
      <SponsorBanner />
      <div role="tablist" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', padding: '0 8px 6px' }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={active === tab.key}
            aria-current={active === tab.key ? 'page' : undefined}
            className={`tab-item${active === tab.key ? ' active' : ''}${tab.key === 'play' ? ' play-tab' : ''}`}
            onClick={() => active !== tab.key && router.push(tab.path)}
          >
            <span className="tab-icon" aria-hidden="true">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
