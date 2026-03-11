'use client'

import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  accent?: string
  subtitle?: string
}

export default function StatCard({ title, value, icon: Icon, accent = '#00432a', subtitle }: StatCardProps) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        padding: '20px 24px',
        border: '1px solid #e5e5e5',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 16,
        flex: 1,
        minWidth: 200,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: `${accent}12`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={22} color={accent} />
      </div>
      <div>
        <div style={{ fontSize: 13, color: '#999', fontWeight: 500, marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#111', lineHeight: 1.1 }}>{value}</div>
        {subtitle && (
          <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>{subtitle}</div>
        )}
      </div>
    </div>
  )
}
