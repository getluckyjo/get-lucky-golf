'use client'

import { useState } from 'react'

type Lane = 'partner' | 'investor'
type Status = 'idle' | 'sending' | 'ok' | 'err'

const COPY: Record<Lane, { placeholder: string; cta: string; success: string }> = {
  partner: {
    placeholder: 'you@yourbrand.com',
    cta: 'Get in touch',
    success: 'Thanks — we’ll be back to you within 24 hours.',
  },
  investor: {
    placeholder: 'you@firm.com',
    cta: 'Start a conversation',
    success: 'Thanks — Johannes will be in touch within 24 hours.',
  },
}

export default function EmailCapture({ lane }: { lane: Lane }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  const copy = COPY[lane]
  const errorId = `email-error-${lane}`

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lane }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('ok')
      setEmail('')
    } catch {
      setStatus('err')
    }
  }

  if (status === 'ok') {
    return (
      <p role="status" className="text-green-deep font-semibold text-sm md:text-base mt-2">
        {copy.success}
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 flex flex-col sm:flex-row gap-2">
      <label className="sr-only" htmlFor={`email-${lane}`}>
        Email address
      </label>
      <input
        id={`email-${lane}`}
        type="email"
        required
        autoComplete="email"
        placeholder={copy.placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'sending'}
        aria-invalid={status === 'err'}
        aria-describedby={status === 'err' ? errorId : undefined}
        className="flex-1 min-w-0 px-4 py-3 rounded-md border border-black/15 bg-white text-gray-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex items-center justify-center bg-green-deep hover:bg-green-dark disabled:bg-green-dark/60 text-white px-5 py-3 rounded-md font-semibold transition whitespace-nowrap"
      >
        {status === 'sending' ? 'Sending…' : copy.cta}
      </button>
      {status === 'err' && (
        <p id={errorId} role="alert" className="text-app-red text-sm w-full">
          Something went wrong. Email johannes@getluckygolf.co.za directly.
        </p>
      )}
    </form>
  )
}
