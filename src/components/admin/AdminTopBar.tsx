'use client'

import { LogOut, Shield } from 'lucide-react'

interface AdminTopBarProps {
  adminName?: string
  adminEmail?: string
}

export default function AdminTopBar({ adminName, adminEmail }: AdminTopBarProps) {
  return (
    <header
      style={{
        height: 64,
        background: '#fff',
        borderBottom: '1px solid #e5e5e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Shield size={18} color="#00432a" />
        <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>Admin Panel</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>
            {adminName || 'Admin'}
          </div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {adminEmail || 'admin@getlucky.golf'}
          </div>
        </div>

        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#00432a',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {(adminName || 'A').charAt(0).toUpperCase()}
        </div>

        <a
          href="/api/auth/signout"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 6,
            border: '1px solid #e5e5e5',
            background: '#fff',
            color: '#666',
            fontSize: 13,
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <LogOut size={14} />
          Logout
        </a>
      </div>
    </header>
  )
}
