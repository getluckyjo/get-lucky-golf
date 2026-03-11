'use client'

import { AlertTriangle } from 'lucide-react'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  variant?: 'danger' | 'success'
  onConfirm: () => void
  onCancel: () => void
  children?: React.ReactNode
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'danger',
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) {
  if (!open) return null

  const btnColor = variant === 'danger' ? '#c0392b' : '#1a7f37'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: 28,
          maxWidth: 440,
          width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: variant === 'danger' ? '#fde8e8' : '#e6f4ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={20} color={btnColor} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 6 }}>{title}</div>
            <div style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>{message}</div>
          </div>
        </div>

        {children && <div style={{ marginBottom: 16 }}>{children}</div>}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: '1px solid #e5e5e5',
              background: '#fff',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              color: '#333',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: 'none',
              background: btnColor,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
