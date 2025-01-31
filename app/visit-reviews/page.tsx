import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline'
import VisitReviewsList from '@/components/VisitReviewsList'

export default async function VisitReviewsPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })

  // Verificar autenticação
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            Você precisa estar logado para ver as avaliações.
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center mt-4 text-purple-600 hover:text-purple-700"
          >
            Fazer login
          </Link>
        </div>
      </div>
    )
  }

  // Buscar reviews e perfis em consultas separadas
  const { data: reviews, error: reviewsError } = await supabase
    .from('visit_reviews')
    .select(`
      id,
      created_at,
      visit_source,
      ratings,
      comments,
      images,
      address,
      full_address,
      property_type,
      listing_url,
      user_id
    `)
    .order('created_at', { ascending: false })

  if (reviewsError) {
    console.error('Erro ao buscar reviews:', reviewsError)
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">
            Erro ao carregar avaliações. Por favor, tente novamente mais tarde.
          </p>
        </div>
      </div>
    )
  }

  // Buscar perfis em uma consulta separada
  const userIds = reviews?.map(review => review.user_id) || []
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url')
    .in('id', userIds)

  if (profilesError) {
    console.error('Erro ao buscar perfis:', profilesError)
  }

  // Combinar reviews com perfis
  const reviewsWithProfiles = reviews.map(review => ({
    ...review,
    profile: profiles?.find(profile => profile.id === review.user_id) || null
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Avaliações de Visitas
        </h1>
        <Link
          href="/visit-reviews/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nova Avaliação
        </Link>
      </div>

      {reviewsWithProfiles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Nenhuma avaliação de visita encontrada.
          </p>
          <Link
            href="/visit-reviews/new"
            className="inline-flex items-center mt-4 text-purple-600 hover:text-purple-700"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Criar primeira avaliação
          </Link>
        </div>
      ) : (
        <VisitReviewsList initialReviews={reviewsWithProfiles} />
      )}
    </div>
  )
} 