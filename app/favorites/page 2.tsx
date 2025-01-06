'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import ReviewsList from '@/components/ReviewsList'
import type { Review } from '@/types/review'
import { useAuth } from '@/contexts/AuthContext'

interface FavoriteWithReview {
  review_id: string
  reviews: {
    id: string
    user_id: string
    apartment_id: string
    rating: number
    content: string
    comment: string
    created_at: string
    images?: string[]
    apartments: {
      id: string
      name: string
      property_type: 'house' | 'apartment'
      address: string
      neighborhood: string
      city: string
      state: string
      zip_code: string
    }
    likes_count?: { count: number }[]
  }
}

export default function FavoritesPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [userMap, setUserMap] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const { currentUserId } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (currentUserId) {
      loadFavorites()
    }
  }, [currentUserId])

  const loadFavorites = async () => {
    try {
      const { data: favorites } = await supabase
        .from('favorites')
        .select(`
          review_id,
          reviews (
            id,
            user_id,
            apartment_id,
            rating,
            content,
            comment,
            created_at,
            images,
            apartments (
              id,
              name,
              property_type,
              address,
              neighborhood,
              city,
              state,
              zip_code
            ),
            likes_count:review_likes(count)
          )
        `)
        .eq('user_id', currentUserId)

      if (favorites) {
        const typedFavorites = favorites as unknown as FavoriteWithReview[]
        
        const reviewsData = typedFavorites.map(f => ({
          ...f.reviews,
          comment: f.reviews.comment || '',
          likes_count: f.reviews.likes_count?.[0] || { count: 0 }
        }))
        
        setReviews(reviewsData)

        // Carregar userMap
        const userIds = Array.from(new Set(reviewsData.map(r => r.user_id)))
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds)

        const newUserMap: Record<string, string> = {}
        profiles?.forEach(profile => {
          newUserMap[profile.id] = profile.username
        })
        setUserMap(newUserMap)
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewDeleted = (reviewId: string) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Meus Favoritos
        </h1>
        
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Você ainda não tem reviews favoritas.
            </p>
          </div>
        ) : (
          <div className="mb-24">
            <ReviewsList
              reviews={reviews}
              userMap={userMap}
              currentUserId={currentUserId}
              onReviewDeleted={handleReviewDeleted}
              layout="square"
            />
          </div>
        )}
      </div>
    </div>
  )
} 