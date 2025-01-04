'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import ReviewCardWrapper from '@/components/ReviewCardWrapper'
import ReviewFilters from '@/components/ReviewFilters'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Review = {
  id: string
  rating: number
  comment: string
  created_at: string
  user_id: string
  likes_count: number
  images?: string[]
  apartment_id?: string
  apartments: {
    id: string
    address: string
    neighborhood: string
    city: string
    state: string
    zip_code: string
    property_type: string
  }
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [cities, setCities] = useState<string[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [userMap, setUserMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [selectedReview, setSelectedReview] = useState<string | null>(null)
  const [selectedComment, setSelectedComment] = useState<string | null>(null)
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    // Verificar parâmetros da URL ao carregar a página
    const params = new URLSearchParams(window.location.search)
    const reviewId = params.get('reviewId')
    const commentId = params.get('commentId')
    const showModal = params.get('showModal')

    if (reviewId && showModal === 'true') {
      setSelectedReviewId(reviewId)
      if (commentId) {
        setSelectedCommentId(commentId)
      }
    }
  }, [])

  const loadInitialData = async () => {
    const supabase = createClient()
    console.log('Carregando dados...') // Debug

    try {
      // Carregar todos os usuários primeiro
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, username')

      if (usersError) {
        console.error('Erro ao carregar usuários:', usersError)
        return
      }

      // Criar mapa de usuários
      const newUserMap: Record<string, string> = {}
      usersData?.forEach(user => {
        newUserMap[user.id] = user.username || 'Usuário'
      })
      console.log('UserMap criado:', newUserMap) // Debug

      // Carregar cidades únicas
      const { data: citiesData, error: citiesError } = await supabase
        .from('apartments')
        .select('city')
        .not('city', 'is', null)
        .order('city')

      if (citiesError) {
        console.error('Erro ao carregar cidades:', citiesError)
      } else {
        const uniqueCities = [...new Set(citiesData.map(a => a.city))]
        setCities(uniqueCities)
      }

      // Carregar reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          user_id,
          images,
          apartment_id,
          apartments!apartment_id (
            id,
            address,
            neighborhood,
            city,
            state,
            zip_code,
            property_type
          ),
          likes_count:review_likes(count)
        `)
        .order('created_at', { ascending: false })

      if (reviewsError) {
        console.error('Erro ao carregar reviews:', reviewsError)
        throw reviewsError
      }

      // Carregar usuário atual
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) console.error('Erro ao carregar usuário:', userError)

      setReviews(
        (reviewsData?.map(review => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at,
          user_id: review.user_id,
          images: review.images,
          apartment_id: review.apartment_id,
          apartments: {
            id: review.apartments[0]?.id,
            address: review.apartments[0]?.address,
            neighborhood: review.apartments[0]?.neighborhood || '',
            city: review.apartments[0]?.city,
            state: review.apartments[0]?.state,
            zip_code: review.apartments[0]?.zip_code,
            property_type: review.apartments[0]?.property_type
          },
          likes_count: typeof review.likes_count === 'number' 
            ? review.likes_count 
            : review.likes_count?.[0]?.count || 0
        })) as Review[]) || []
      )
      setCurrentUserId(user?.id || null)
      setUserMap(newUserMap)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = async (filters) => {
    const supabase = createClient()
    
    try {
      console.log('Iniciando busca com filtros:', filters)
      
      // Primeiro, buscar os apartamentos que correspondem à busca
      let apartmentsQuery = supabase
        .from('apartments')
        .select('id')

      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase()
        apartmentsQuery = apartmentsQuery.or(
          `address.ilike.%${searchTerm}%,` +
          `neighborhood.ilike.%${searchTerm}%,` +
          `city.ilike.%${searchTerm}%,` +
          `state.ilike.%${searchTerm}%,` +
          `zip_code.ilike.%${searchTerm}%`
        )
      }

      if (filters.city) {
        apartmentsQuery = apartmentsQuery.eq('city', filters.city)
      }

      if (filters.propertyType) {
        apartmentsQuery = apartmentsQuery.eq('property_type', filters.propertyType)
      }

      const { data: matchingApartments, error: apartmentsError } = await apartmentsQuery

      if (apartmentsError) {
        console.error('Erro ao buscar apartamentos:', apartmentsError)
        throw apartmentsError
      }

      console.log('Apartamentos encontrados:', matchingApartments?.length)

      // Se encontrou apartamentos, buscar as reviews correspondentes
      if (matchingApartments && matchingApartments.length > 0) {
        const apartmentIds = matchingApartments.map(apt => apt.id)

        let reviewsQuery = supabase
          .from('reviews')
          .select(`
            id,
            rating,
            comment,
            created_at,
            user_id,
            images,
            apartment_id,
            apartments!apartment_id (
              id,
              address,
              neighborhood,
              city,
              state,
              zip_code,
              property_type
            ),
            likes_count:review_likes(count)
          `)
          .in('apartment_id', apartmentIds)

        if (filters.minRating) {
          reviewsQuery = reviewsQuery.gte('rating', filters.minRating)
        }

        // Aplicar ordenação
        switch (filters.sortBy) {
          case 'rating':
            reviewsQuery = reviewsQuery.order('rating', { ascending: false })
            break
          case 'likes':
            reviewsQuery = reviewsQuery.order('likes_count', { ascending: false })
            break
          default:
            reviewsQuery = reviewsQuery.order('created_at', { ascending: false })
        }

        const { data: reviews, error: reviewsError } = await reviewsQuery

        if (reviewsError) {
          console.error('Erro ao buscar reviews:', reviewsError)
          throw reviewsError
        }

        console.log('Reviews encontradas:', reviews?.length)
        setReviews(reviews || [])
      } else {
        // Se não encontrou apartamentos, limpar as reviews
        setReviews([])
      }
    } catch (error) {
      console.error('Erro ao filtrar:', error)
      setReviews([])
    }
  }

  // Função para fechar o modal
  const handleCloseModal = () => {
    setSelectedReviewId(null)
    setSelectedCommentId(null)
    // Limpar parâmetros da URL
    window.history.replaceState({}, '', '/reviews')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            Carregando reviews...
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Todas as Reviews</h1>
              <p className="text-primary-100">
                Explore todas as experiências compartilhadas pela comunidade
              </p>
            </div>
            {currentUserId && (
              <Link
                href="/new-review"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-full font-semibold hover:bg-primary-50 transition-colors duration-200"
              >
                Nova Review
              </Link>
            )}
          </div>
        </div>

        {/* Filters */}
        <ReviewFilters
          cities={cities}
          onFilterChange={handleFilterChange}
        />

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCardWrapper
              key={review.id}
              review={review}
              username={userMap[review.user_id]}
              currentUserId={currentUserId}
              userMap={userMap}
              isSelected={review.id === selectedReviewId}
              selectedCommentId={selectedCommentId}
              onClose={handleCloseModal}
            />
          ))}
        </div>

        {/* Empty State */}
        {reviews.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">
              Nenhuma review encontrada
            </h3>
            <p className="text-gray-600 mb-6">
              Tente ajustar os filtros ou seja o primeiro a compartilhar sua experiência!
            </p>
            {currentUserId ? (
              <Link
                href="/new-review"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Criar Review
              </Link>
            ) : (
              <Link
                href="/auth"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Fazer Login para Criar Review
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  )
} 