'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useAuth } from '@/context/AuthContext'

function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signInWithGoogle, signInWithMagicLink, user } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [handicap, setHandicap] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const oauthError = searchParams.get('error')

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) router.push('/home')
  }, [user, router])

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setErrorMsg('')

    // Store name for profile setup after auth
    if (firstName) {
      localStorage.setItem('pending_name', `${firstName} ${lastName}`.trim())
    }
    if (handicap) {
      localStorage.setItem('pending_handicap', handicap)
    }

    const { error } = await signInWithMagicLink(email)
    if (error) {
      setErrorMsg(error)
      setLoading(false)
    } else {
      setSent(true)
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setLoading(true)
    await signInWithGoogle()
    // Page will redirect — no need to setLoading(false)
  }

  if (sent) {
    return (
      <PhoneFrame statusTheme="dark">
        <div className="screen-signup">
          <div className="signup-title-area" style={{ marginTop: 80 }}>
            <div style={{ fontSize: 'var(--text-hero)', marginBottom: 'var(--space-md)' }}>📧</div>
            <h3 className="signup-title">Check Your Email</h3>
            <p className="signup-sub" style={{ maxWidth: 260 }}>
              We sent a magic link to <strong>{email}</strong>. Click it to sign in.
            </p>
          </div>
          <div className="signup-footer">
            <button className="btn-share" onClick={() => setSent(false)}>
              ← Use a different email
            </button>
          </div>
        </div>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame statusTheme="dark">
      <div className="screen-signup">
        <div className="signup-header">
          <button className="back-btn" onClick={() => router.push('/onboarding')}>←</button>
        </div>
        <div style={{ textAlign: 'center', padding: 'var(--space-xs) var(--page-px) 0' }}>
          <img src="/logo.svg" alt="Get Lucky Golf Club" className="logo-header-dark" />
        </div>
        <div className="signup-title-area" style={{ paddingTop: 12 }}>
          <h3 className="signup-title">Create Your Profile</h3>
          <p className="signup-sub">Join 15,000+ golfers already playing</p>
        </div>

        {oauthError && (
          <div style={{ margin: '0 var(--page-px) var(--space-sm)', padding: 'var(--space-sm) var(--space-md)', background: 'rgba(220,50,50,0.1)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-body)', color: '#c0392b' }}>
            Sign-in failed. Please try again.
          </div>
        )}

        <form className="signup-form" onSubmit={handleCreateAccount}>
          <div className="social-login">
            <button type="button" className="social-btn" onClick={handleGoogleLogin} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
          <div className="or-divider">or sign up with email</div>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                placeholder="Johannes"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Surname</label>
              <input
                placeholder="Le Roux"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Handicap <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#bbb' }}>(optional)</span></label>
            <input
              type="number"
              placeholder="e.g. 18"
              min={0}
              max={54}
              value={handicap}
              onChange={e => setHandicap(e.target.value)}
            />
          </div>

          {errorMsg && (
            <div style={{ fontSize: 'var(--text-sm)', color: '#c0392b', padding: '4px 0' }}>{errorMsg}</div>
          )}

          {/* Spacer so the last field isn't hidden behind the fixed button */}
          <div style={{ height: 80, flexShrink: 0 }} />
        </form>

        <div className="signup-footer">
          <button
            className="btn-primary"
            onClick={handleCreateAccount as React.MouseEventHandler}
            disabled={loading || !email}
            style={{ opacity: loading || !email ? 0.7 : 1 }}
          >
            {loading ? 'Sending link...' : 'Get Started →'}
          </button>
        </div>
      </div>
    </PhoneFrame>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <PhoneFrame statusTheme="dark">
        <div className="screen-signup" />
      </PhoneFrame>
    }>
      <AuthForm />
    </Suspense>
  )
}
