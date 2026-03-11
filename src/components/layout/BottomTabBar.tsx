'use client'

import { useRouter } from 'next/navigation'

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
    <div className="bottom-tab-bar">
      {TABS.map(tab => (
        <button
          key={tab.key}
          className={`tab-item${active === tab.key ? ' active' : ''}${tab.key === 'play' ? ' play-tab' : ''}`}
          onClick={() => active !== tab.key && router.push(tab.path)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
