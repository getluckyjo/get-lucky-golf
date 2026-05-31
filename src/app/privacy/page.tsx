'use client'

import { useRouter } from 'next/navigation'
import PhoneFrame from '@/components/layout/PhoneFrame'

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <div style={{ fontSize: 'var(--text-body)', color: 'var(--gray-mid)', lineHeight: 1.7 }}>
          <p style={{ marginBottom: 16 }}>
            <strong>Effective Date:</strong> March 2026
          </p>
          <p style={{ marginBottom: 16 }}>
            Get Lucky Golf respects your privacy and is committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA).
          </p>

          <h3 style={{ color: 'var(--green-deep)', marginBottom: 8, marginTop: 24, fontSize: 'var(--text-md)' }}>What We Collect</h3>
          <p style={{ marginBottom: 16 }}>We collect your name, email address, and payment information when you create an account and enter challenges. We also store video recordings of your shots for verification purposes.</p>

          <h3 style={{ color: 'var(--green-deep)', marginBottom: 8, marginTop: 24, fontSize: 'var(--text-md)' }}>How We Use It</h3>
          <p style={{ marginBottom: 16 }}>Your information is used solely to operate the platform, process payments via PayFast, verify claims, and communicate with you about your account.</p>

          <h3 style={{ color: 'var(--green-deep)', marginBottom: 8, marginTop: 24, fontSize: 'var(--text-md)' }}>Data Security</h3>
          <p style={{ marginBottom: 16 }}>We use industry-standard encryption and secure hosting. Payment data is handled exclusively by PayFast and never stored on our servers.</p>

          <h3 style={{ color: 'var(--green-deep)', marginBottom: 8, marginTop: 24, fontSize: 'var(--text-md)' }}>Your Rights</h3>
          <p style={{ marginBottom: 16 }}>You may request access to, correction of, or deletion of your personal information at any time by contacting support@getluckygolf.co.za</p>

          <h3 style={{ color: 'var(--green-deep)', marginBottom: 8, marginTop: 24, fontSize: 'var(--text-md)' }}>Third Parties</h3>
          <p style={{ marginBottom: 16 }}>We share data only with PayFast (payments), Indwe Risk Services (insurance), and Supabase (hosting). We never sell your data.</p>
        </div>
      </div>
    </PhoneFrame>
  )
}
