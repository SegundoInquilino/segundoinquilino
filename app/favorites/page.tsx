'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import ReviewsList from '@/components/ReviewsList'
import type { Review } from '@/types/review'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function FavoritesPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [userMap, setUserMap] = useState<Record<string, string>>({})
  const router = useRouter()
  const supabase = createClient()
  const { currentUserId } = useAuth()

  useEffect(() => {
    loadFavorites()

    // Adicionar listeners para likes/unlikes
    const handleLike = () => {
      loadFavorites() // Recarregar a lista quando uma review for curtida
    }

    const handleUnlike = () => {
      loadFavorites() // Recarregar a lista quando uma review for descurtida
    }

    window.addEventListener('reviewLiked', handleLike)
    window.addEventListener('reviewUnliked', handleUnlike)

    return () => {
      window.removeEventListener('reviewLiked', handleLike)
      window.removeEventListener('reviewUnliked', handleUnlike)
    }
  }, [])

  const loadFavorites = async () => {
    try {
      // Verificar se o usuário está logado
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      // Carregar reviews curtidas pelo usuário
      const { data: likedReviews } = await supabase
        .from('review_likes')
        .select(`
          review:reviews (
            *,
            apartments (*),
            likes:review_likes(count)
          )
        `)
        .eq('user_id', user.id)

      if (likedReviews) {
        const reviews = likedReviews.map(item => item.review) as Review[]
        setReviews(reviews)

        // Carregar userMap
        const userIds = Array.from(new Set(reviews.map(r => r.user_id)))
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds)

        const newUserMap: Record<string, string> = {}
        profiles?.forEach(profile => {
          newUserMap[profile.id] = profile.username || 'Usuário'
        })
        setUserMap(newUserMap)
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm h-64"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Meus Favoritos</h1>
        
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum favorito ainda
            </h3>
            <p className="text-gray-500">
              As reviews que você curtir aparecerão aqui.
            </p>
          </div>
        ) : (
          <ReviewsList
            reviews={reviews}
            userMap={userMap}
            currentUserId={currentUserId}
            onReviewDeleted={loadFavorites}
          />
        )}
      </div>
    </div>
  )
} 