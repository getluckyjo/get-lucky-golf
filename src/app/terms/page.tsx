'use client'

import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'

export default function TermsPage() {
  const router = useRouter()

  return (
    <PhoneFrame statusTheme="dark">
      <div style={{ width: '100%', height: '100%', background: 'var(--cream-light)', overflowY: 'auto', padding: '60px var(--page-px) var(--space-2xl)' }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 36, height: 36, background: '#f5f0e8', border: 'none',
            borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-lg)',
            cursor: 'pointer', color: 'var(--green-deep)', marginBottom: 'var(--space-md)',
          }}
        >
          ←
        </button>
        <h1 style={{ fontFamily: 'Poster Gothic, sans-serif', fontSize: 'var(--text-2xl)', fontWeight: 900, color: 'var(--green-deep)', marginBottom: 'var(--space-sm)' }}>
          Terms &amp; Conditions
        </h1>
        <div style={{ fontSize: 'var(--text-body)', color: 'var(--gray-mid)', lineHeight: 1.7 }}>
          <p style={{ marginBottom: 16 }}>
            <strong>Effective Date:</strong> March 2026
          </p>
          <p style={{ marginBottom: 16 }}>
            Get Lucky Golf (&quot;the Platform&quot;) is a skill-based challenge platform where registered users stake on their ability to hit a hole-in-one on designated par-3 holes at participating golf courses across South Africa.
          </p>
          <h3 style={{ color: 'var(--green-deep)', marginBottom: 8, marginTop: 24, fontSize: 'var(--text-md)' }}>1. Eligibility</h3>
          <p style={{ marginBottom: 16 }}>You must be 18 years or older and a resident of South Africa to participate. By creating an account you confirm that you meet these requirements.</p>

          <h3 style={{ color: 'var(--green-deep)', marginBottom: 8, marginTop: 24, fontSize: 'var(--text-md)' }}>2. How It Works</h3>
          <p style={{ marginBottom: 16 }}>Select a participating course and par-3 hole. Choose a stake tier (R50–R1 000). Record your tee shot via the app. If your shot results in a verified hole-in-one, you win the corresponding prize (up to R1 000 000).</p>

          <h3 style={{ color: 'var(--green-deep)', marginBottom: 8, marginTop: 24, fontSize: 'var(--text-md)' }}>3. Verification</h3>
          <p style={{ marginBottom: 16 }}>All claims require video evidence and supporting documentation (course scorecard, witness affidavit). Claims are reviewed within 5 business days. Get Lucky reserves the right to request additional evidence.</p>

          <h3 style={{ color: 'var(--green-deep)', marginBottom: 8, marginTop: 24, fontSize: 'var(--text-md)' }}>4. Prizes &amp; Insurance</h3>
          <p style={{ marginBottom: 16 }}>All prizes are fully insured by Indwe Risk Services (FSP 3425), an authorised Financial Services Provider. Verified prizes are paid within 14 business days of approval.</p>

          <h3 style={{ color: 'var(--green-deep)', marginBottom: 8, marginTop: 24, fontSize: 'var(--text-md)' }}>5. Payments</h3>
          <p style={{ marginBottom: 16 }}>All payments are processed securely via PayFast. Stakes are non-refundable once a round has been recorded.</p>

          <h3 style={{ color: 'var(--green-deep)', marginBottom: 8, marginTop: 24, fontSize: 'var(--text-md)' }}>6. Contact</h3>
          <p style={{ marginBottom: 16 }}>For queries, contact support@getluckygolf.co.za</p>
        </div>
      </div>
    </PhoneFrame>
  )
}
