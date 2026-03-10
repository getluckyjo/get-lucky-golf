import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function RootPage() {
  let session = null

  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getSession()
    session = data.session
  } catch {
    // Supabase not configured yet — fall through to splash
  }

  if (!session) {
    redirect('/splash')
  }

  // User is authenticated — check if payment setup done
  try {
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('payment_setup_done')
      .eq('id', session.user.id)
      .single()

    if (!profile?.payment_setup_done) {
      redirect('/payment-setup')
    }
  } catch {
    // Profile not found or Supabase error — go to home
  }

  redirect('/home')
}
