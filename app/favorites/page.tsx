'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import type { Review } from '@/types/review'
import ReviewCardWrapper from '@/components/ReviewCardWrapper'

export default function FavoritesPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { currentUserId } = useAuth()
  const [userMap, setUserMap] = useState<Record<string, string>>({})

  useEffect(() => {
    if (currentUserId) {
      loadFavorites()
    }
  }, [currentUserId])

  const loadFavorites = async () => {
    try {
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          apartments!inner (*),
          review_likes (count)
        `)
        .in(
          'id',
          (await supabase
            .from('favorites')
            .select('review_id')
            .eq('user_id', currentUserId)
          ).data?.map(f => f.review_id) || []
        )

      if (!reviewsData?.length) {
        setReviews([])
        return
      }

      const formattedReviews = reviewsData.map(review => ({
        ...review,
        apartments: review.apartments,
        likes_count: review.review_likes?.[0]?.count || 0
      }))

      const userIds = [...new Set(formattedReviews.map(r => r.user_id))]
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds)

      const newUserMap: Record<string, string> = {}
      profiles?.forEach(profile => {
        newUserMap[profile.id] = profile.username
      })

      setUserMap(newUserMap)
      setReviews(formattedReviews)
    } catch (error) {
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Faça login para ver seus favoritos
          </h1>
          <p className="text-gray-600">
            Você precisa estar logado para acessar seus favoritos.
          </p>
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

        {loading ? (
          <div className="text-center">Carregando...</div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Nenhum favorito ainda
            </h2>
            <p className="text-gray-600">
              Clique no ❤️ nas reviews para adicionar aos favoritos.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(review => (
              <ReviewCardWrapper
                key={review.id}
                review={review}
                username={userMap[review.user_id] || ''}
                currentUserId={currentUserId}
                userMap={userMap}
                onReviewDeleted={loadFavorites}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 