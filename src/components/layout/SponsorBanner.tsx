'use client'

import Image from 'next/image'

export default function SponsorBanner() {
  return (
    <div style={{
      width: '100%',
      padding: '6px 16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f5f5f5',
      borderTop: '1px solid #e5e5e5',
    }}>
      <Image
        src="/GLG_Indwe_FSP_Banner.png"
        alt="Proudly sponsored by Indwe Risk Services"
        width={400}
        height={50}
        priority
        style={{ width: '100%', maxWidth: 300, height: 'auto' }}
      />
    </div>
  )
}
