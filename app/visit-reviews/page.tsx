import { createClient } from '@/utils/supabase-server'
import VisitReviewsClient from './components/client'
import { cookies } from 'next/headers'

export const revalidate = 0

export default async function VisitReviewsPage() {
  const cookieStore = cookies()
  const supabase = createClient()
  
  const { data: visitReviews, error: reviewsError } = await supabase
    .from('visit_reviews')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (reviewsError) {
    console.error('Erro ao buscar reviews:', reviewsError)
    return null
  }

  const userIds = visitReviews?.map(review => review.user_id) || []
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username')
    .in('id', userIds)

  const reviewsWithProfiles = visitReviews?.map(review => ({
    ...review,
    profiles: profiles?.find(profile => profile.id === review.user_id)
  }))

  return <VisitReviewsClient initialReviews={reviewsWithProfiles || []} />
} 