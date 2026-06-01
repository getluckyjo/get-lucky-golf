'use client'

// Small cosmetic "Member" pill. Status-only — confers no mechanical perk.
export default function MemberBadge({
  size = 'md',
  style,
}: {
  size?: 'sm' | 'md'
  style?: React.CSSProperties
}) {
  const sm = size === 'sm'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sm ? 4 : 5,
        padding: sm ? '2px 8px' : '3px 10px',
        borderRadius: 20,
        background: 'linear-gradient(135deg, #d8bd6a, #c9a94e)',
        color: '#3a2f12',
        fontSize: sm ? 10 : 'var(--text-xs)',
        fontWeight: 800,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        lineHeight: 1,
        boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
        ...style,
      }}
    >
      <svg width={sm ? 10 : 12} height={sm ? 10 : 12} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2l2.6 6.5L21 9l-5 4.3L17.5 20 12 16.5 6.5 20 8 13.3 3 9l6.4-.5z" />
      </svg>
      Member
    </span>
  )
}
