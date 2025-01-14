'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import ReviewCardWrapper from '@/components/ReviewCardWrapper'
import type { Review } from '@/types/review'

export default function FavoritesPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [userMap, setUserMap] = useState<Record<string, string>>({})
  const { currentUserId } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    const loadFavorites = async () => {
      if (!currentUserId) return

      try {
        // Primeiro, buscar os IDs dos favoritos
        const { data: favoritesData, error: favoritesError } = await supabase
          .from('favorites')
          .select('review_id')
          .eq('user_id', currentUserId)

        if (favoritesError) throw favoritesError

        if (!favoritesData?.length) {
          setLoading(false)
          return
        }

        const reviewIds = favoritesData.map(f => f.review_id)

        // Depois, buscar as reviews completas
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            apartments!inner (
              building_name,
              address,
              neighborhood,
              city,
              state,
              zip_code,
              id
            )
          `)
          .in('id', reviewIds)

        if (reviewsError) throw reviewsError

        // Processar os dados para incluir todos os campos necessários
        const processedReviews: Review[] = reviewsData.map(review => ({
          ...review,
          amenities: review.amenities || [],
          pros: review.pros || null,
          cons: review.cons || null,
          likes_count: review.likes_count || { count: 0 },
          profiles: undefined
        }))

        setReviews(processedReviews)

        // Carregar userMap
        const userIds = Array.from(new Set(reviewsData.map(r => r.user_id)))
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds)

        if (profilesError) throw profilesError

        const newUserMap: Record<string, string> = {}
        profiles?.forEach(profile => {
          newUserMap[profile.id] = profile.username
        })
        setUserMap(newUserMap)

      } catch (error) {
        console.error('Erro ao carregar favoritos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [currentUserId])

  const handleReviewDeleted = (reviewId: string) => {
    setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Meus Favoritos
        </h1>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Nenhum favorito ainda
            </h3>
            <p className="text-gray-600">
              Você ainda não adicionou nenhuma review aos favoritos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(review => (
              <ReviewCardWrapper
                key={review.id}
                review={review}
                currentUserId={currentUserId}
                userMap={userMap}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 