import PhoneFrame from '@/components/layout/PhoneFrame'

export default function PlayLoading() {
  return (
    <PhoneFrame statusTheme="light">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: 'linear-gradient(180deg, #1e3120 0%, #335231 100%)',
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid rgba(255,255,255,0.15)',
          borderTopColor: '#d4af37',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </PhoneFrame>
  )
}
