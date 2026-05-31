import PhoneFrame from '@/components/layout/PhoneFrame'

export default function DashboardLoading() {
  return (
    <PhoneFrame statusTheme="dark">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        background: 'var(--cream-light, #faf8f2)',
      }}>
        <div style={{
          width: 40, height: 40,
          border: '3px solid #e5e7eb',
          borderTopColor: '#335231',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </PhoneFrame>
  )
}
