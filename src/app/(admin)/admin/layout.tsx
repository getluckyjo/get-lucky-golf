'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopBar from '@/components/admin/AdminTopBar'
import { useAuth } from '@/context/AuthContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [pendingClaims, setPendingClaims] = useState(0)
  const [adminInfo, setAdminInfo] = useState({ name: '', email: '' })

  const isAdmin = profile?.is_admin === true

  useEffect(() => {
    if (loading) return
    if (!user || !isAdmin) {
      router.replace('/home')
      return
    }

    // Fetch pending claims count for sidebar badge
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => {
        if (data.pendingClaims !== undefined) setPendingClaims(data.pendingClaims)
        if (data.adminName) setAdminInfo({ name: data.adminName, email: data.adminEmail || '' })
      })
      .catch(() => {})
  }, [loading, user, isAdmin, router])

  // Show loading spinner while auth state resolves
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: '#f7f7f8',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #e5e7eb',
          borderTopColor: '#335231', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // Don't render admin UI for non-admins (redirect is in progress)
  if (!user || !isAdmin) {
    return null
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#f7f7f8',
        fontFamily: "'Inter', system-ui, sans-serif",
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
