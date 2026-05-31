import { BetProvider } from '@/context/BetContext'

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return <BetProvider>{children}</BetProvider>
}
