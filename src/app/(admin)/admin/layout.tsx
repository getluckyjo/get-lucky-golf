'use client'

import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [pendingClaims, setPendingClaims] = useState(0)
  const [adminInfo, setAdminInfo] = useState({ name: '', email: '' })

  useEffect(() => {
    // Fetch pending claims count for sidebar badge
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => {
        if (data.pendingClaims !== undefined) setPendingClaims(data.pendingClaims)
        if (data.adminName) setAdminInfo({ name: data.adminName, email: data.adminEmail || '' })
      })
      .catch(() => {})
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f7f7f8',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
    >
      <AdminSidebar pendingClaims={pendingClaims} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <AdminTopBar adminName={adminInfo.name} adminEmail={adminInfo.email} />
        <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
