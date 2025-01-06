'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useRouter } from 'next/navigation'
import ReviewsList from '@/components/ReviewsList'
import type { Review } from '@/types/review'
import { useAuth } from '@/contexts/AuthContext'

interface ProfileClientProps {
  id: string
}

export default function ProfileClient({ id }: ProfileClientProps) {
  const [profile, setProfile] = useState<any>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [userMap, setUserMap] = useState<Record<string, string>>({})
  const router = useRouter()
  const supabase = createClient()
  const { currentUserId } = useAuth()

  useEffect(() => {
    loadProfile()
  }, [id])

  const loadProfile = async () => {
    try {
      const { data: settings } = await supabase
        .from('user_settings')
        .select('show_profile, show_reviews')
        .eq('user_id', id)
        .single()

      if (!settings?.show_profile) {
        return { error: 'Perfil privado' }
      }

      // Carregar dados do perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (profile) {
        setProfile(profile)
      }

      // Carregar reviews se permitido
      if (settings.show_reviews) {
        const { data: userReviews } = await supabase
          .from('reviews')
          .select(`
            *,
            apartments (*),
            likes:review_likes(count)
          `)
          .eq('user_id', id)

        if (userReviews) {
          setReviews(userReviews)

          // Atualizar userMap
          const newUserMap: Record<string, string> = {}
          newUserMap[id] = profile?.username || 'Usuário'
          setUserMap(newUserMap)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
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
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-medium text-purple-600">
                {profile?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile?.username || 'Usuário'}
              </h1>
              <p className="text-gray-500">
                Membro desde {new Date(profile?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Reviews</h2>
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma review ainda
            </h3>
            <p className="text-gray-500">
              As reviews aparecerão aqui quando forem publicadas.
            </p>
          </div>
        ) : (
          <ReviewsList
            reviews={reviews}
            userMap={userMap}
            currentUserId={currentUserId}
            onReviewDeleted={loadProfile}
          />
        )}
      </div>
    </div>
  )
} 