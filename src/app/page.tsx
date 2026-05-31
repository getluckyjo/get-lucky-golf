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

  redirect('/home')
}
