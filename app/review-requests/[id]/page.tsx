import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import RequestDetailsClient from './client'

export const dynamic = 'force-dynamic'

export default async function RequestDetailsPage({
  params,
}: {
  params: any
}) {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth')
  }

  const { data: request } = await supabase
    .from('review_requests')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!request) {
    redirect('/review-requests')
  }

  return <RequestDetailsClient request={request} user={session.user} />
} 