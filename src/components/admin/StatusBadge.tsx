'use client'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'gold'

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; color: string }> = {
  success: { bg: '#e6f4ea', color: '#1a7f37' },
  warning: { bg: '#fff8e1', color: '#a07820' },
  danger: { bg: '#fde8e8', color: '#c0392b' },
  info: { bg: '#e3f2fd', color: '#1565c0' },
  neutral: { bg: '#f0f0f0', color: '#666' },
  gold: { bg: '#fdf4e3', color: '#b8860b' },
}

// Status → variant mapping
const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  active: 'info',
  miss: 'neutral',
  claimed: 'gold',
  verified: 'success',
  paid: 'success',
  pending: 'warning',
  documents_received: 'gold',
  under_review: 'info',
  approved: 'success',
  rejected: 'danger',
}

interface StatusBadgeProps {
  status: string
  variant?: BadgeVariant
  small?: boolean
}

export default function StatusBadge({ status, variant, small }: StatusBadgeProps) {
  const v = variant || STATUS_VARIANTS[status] || 'neutral'
  const styles = VARIANT_STYLES[v]
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <span
      style={{
        display: 'inline-block',
        padding: small ? '2px 8px' : '3px 10px',
        borderRadius: 12,
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        background: styles.bg,
        color: styles.color,
        whiteSpace: 'nowrap',
        textTransform: 'capitalize',
      }}
    >
      {label}
    </span>
  )
}
