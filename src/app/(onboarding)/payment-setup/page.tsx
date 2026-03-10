'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'

const methods = [
  { id: 'apple_pay', icon: '🍎', name: 'Apple Pay', desc: 'Fastest checkout at the tee' },
  { id: 'google_pay', icon: '🅶', name: 'Google Pay', desc: 'Quick tap-and-go' },
  { id: 'card', icon: '💳', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex' },
  { id: 'eft', icon: '🏦', name: 'EFT / Bank Transfer', desc: 'Direct bank payment' },
]

export default function PaymentSetupPage() {
  const router = useRouter()
  const { user, refreshProfile } = useAuth()
  const [selected, setSelected] = useState('card')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    setLoading(true)

    if (user) {
      const supabase = createClient()

      // Pick up any pending profile data stored during signup
      const pendingName = localStorage.getItem('pending_name')
      const pendingHandicap = localStorage.getItem('pending_handicap')

      await supabase.from('profiles').upsert({
        id: user.id,
        payment_method: selected,
        payment_setup_done: true,
        onboarding_done: true,
        ...(pendingName ? { name: pendingName } : {}),
        ...(pendingHandicap ? { handicap: parseInt(pendingHandicap, 10) } : {}),
      })

      localStorage.removeItem('pending_name')
      localStorage.removeItem('pending_handicap')
      await refreshProfile()
    } else {
      // Not authenticated — store locally and proceed
      localStorage.setItem('payment_method', selected)
      await new Promise(r => setTimeout(r, 400))
    }

    setLoading(false)
    router.push('/home')
  }

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0]?.toUpperCase() ?? 'YOUR NAME'

  return (
    <PhoneFrame statusTheme="dark">
      <div className="screen-payment">
        <div className="signup-header" style={{ padding: '20px 24px 0' }}>
          <button className="back-btn" onClick={() => router.back()}>←</button>
        </div>
        <div className="signup-title-area" style={{ padding: '16px 24px' }}>
          <h3 className="signup-title">Payment Setup</h3>
          <p className="signup-sub">Save once, enter instantly every round</p>
        </div>
        <div className="payment-card-preview">
          <div className="card-type">Get Lucky Wallet</div>
          <div className="card-number">•••• •••• •••• 4829</div>
          <div className="card-bottom">
            <span>{displayName}</span>
            <span>VISA</span>
          </div>
        </div>
        <div className="payment-methods">
          <div className="payment-methods-title">Payment Method</div>
          {methods.map(m => (
            <div
              key={m.id}
              className={`payment-option${selected === m.id ? ' selected' : ''}`}
              onClick={() => setSelected(m.id)}
            >
              <div className="payment-option-icon">{m.icon}</div>
              <div className="payment-option-text">
                <h5>{m.name}</h5>
                <p>{m.desc}</p>
              </div>
              <div className="payment-radio" />
            </div>
          ))}
        </div>
        <div className="payment-secure">🔒 256-bit SSL encrypted</div>
        <div style={{ padding: '0 24px 40px' }}>
          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}
