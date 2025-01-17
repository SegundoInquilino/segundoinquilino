import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import ReviewRequestsClient from './client'

export default async function ReviewRequestsPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth')
  }

  const { data: requests } = await supabase
    .from('review_requests')
    .select('*')
    .order('created_at', { ascending: false })

  return <ReviewRequestsClient initialRequests={requests || []} user={session.user} />
} 