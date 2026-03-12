'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'
import { useAuth } from '@/context/AuthContext'
import { ArrowLeft, Mail } from 'lucide-react'

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

  useEffect(() => {
    if (user) router.push('/home')
  }, [user, router])

  async function handleCreateAccount(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setErrorMsg('')

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
  }

  /* ── Magic link sent state ── */
  if (sent) {
    return (
      <PhoneFrame statusTheme="dark">
        <div className="screen-signup">
          <div className="auth-sent-container">
            <div className="auth-sent-icon">
              <Mail size={32} stroke="var(--green-deep)" strokeWidth={1.5} />
            </div>
            <h3 className="signup-title" style={{ textAlign: 'center' }}>Check Your Email</h3>
            <p className="signup-sub" style={{ textAlign: 'center', maxWidth: 260, margin: '0 auto' }}>
              We sent a magic link to <strong>{email}</strong>. Click it to sign in.
            </p>
            <button
              className="auth-link-btn"
              onClick={() => setSent(false)}
            >
              <ArrowLeft size={14} /> Use a different email
            </button>
          </div>
        </div>
      </PhoneFrame>
    )
  }

  /* ── Main auth form ── */
  return (
    <PhoneFrame statusTheme="dark">
      <div className="screen-signup">
        {/* Header */}
        <div className="auth-header">
          <button className="auth-back" onClick={() => router.push('/onboarding')}>
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
          <img src="/logo.svg" alt="Get Lucky Golf Club" className="auth-logo" />
        </div>

        {/* Title area */}
        <div className="auth-title-area">
          <h3 className="signup-title">Create Your Profile</h3>
          <p className="signup-sub">Join 15,000+ golfers already playing</p>
        </div>

        {oauthError && (
          <div className="auth-error">Sign-in failed. Please try again.</div>
        )}

        {/* Form */}
        <form className="signup-form" onSubmit={handleCreateAccount}>
          {/* Google */}
          <button
            type="button"
            className="auth-google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="or-divider">or sign up with email</div>

          {/* Name row */}
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

          {/* Email */}
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

          {/* Handicap */}
          <div className="form-group">
            <label>
              Handicap <span className="label-optional">(optional)</span>
            </label>
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
            <div className="auth-error-inline">{errorMsg}</div>
          )}
        </form>

        {/* Footer — pinned at bottom */}
        <div className="auth-footer">
          <button
            className="btn-primary"
            onClick={handleCreateAccount as React.MouseEventHandler}
            disabled={loading || !email}
            style={{ opacity: loading || !email ? 0.5 : 1 }}
          >
            {loading ? 'Sending link...' : 'Get Started'}
          </button>
          <p className="auth-terms">
            By continuing, you agree to our{' '}
            <span className="auth-terms-link">Terms of Service</span> and{' '}
            <span className="auth-terms-link">Privacy Policy</span>
          </p>
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
