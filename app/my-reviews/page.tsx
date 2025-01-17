import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import MyReviewsClient from './client'

export const dynamic = 'force-dynamic'

export default async function MyReviewsPage() {
  try {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      redirect('/auth?redirect=/my-reviews')
    }

    // Buscar reviews vinculadas ao email do usuário logado
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select(`
        *,
        review_requests!inner (
          id,
          building_name,
          address,
          email,
          status
        )
      `)
      .eq('requester_email', session.user.email) // Busca pelo email do solicitante
      .order('created_at', { ascending: false })

    if (reviewsError) {
      console.error('Erro ao buscar reviews:', reviewsError)
      return <MyReviewsClient requests={[]} reviewers={{}} />
    }

    if (!reviews?.length) {
      return <MyReviewsClient requests={[]} reviewers={{}} />
    }

    // Buscar os dados dos reviewers
    const reviewerIds = reviews.map(review => review.user_id)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', reviewerIds)

    const reviewers = (profiles || []).reduce((acc, profile) => ({
      ...acc,
      [profile.id]: profile.username
    }), {})

    // Formatar os dados para o componente cliente
    const formattedRequests = reviews.map(review => ({
      ...review.review_requests,
      reviews: [review]
    }))

    console.log('Dados encontrados:', {
      requests: formattedRequests,
      reviewers
    })

    console.log('Debug - Query my-reviews:', {
      userEmail: session.user.email,
      foundReviews: reviews
    })

    return <MyReviewsClient requests={formattedRequests} reviewers={reviewers} />
  } catch (error) {
    console.error('Erro não tratado:', error)
    return <MyReviewsClient requests={[]} reviewers={{}} />
  }
} 