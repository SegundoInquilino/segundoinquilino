'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { Review } from '@/types/review'
import ReviewsList from '@/components/ReviewsList'
import { useAuth } from '@/contexts/AuthContext'

interface BuildingPageClientProps {
  buildingName: string
}

export default function BuildingPageClient({ buildingName }: BuildingPageClientProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [userMap, setUserMap] = useState<Record<string, string>>({})
  const { currentUserId } = useAuth()

  useEffect(() => {
    loadBuildingReviews()
  }, [buildingName])

  const loadBuildingReviews = async () => {
    try {
      const supabase = createClient()

      // Primeiro buscar o apartamento
      const { data: apartment } = await supabase
        .from('apartments')
        .select('*')
        .eq('building_name', buildingName)
        .single()

      if (!apartment) return

      // Buscar reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (
            username,
            full_name
          ),
          likes_count:review_likes(count)
        `)
        .eq('apartment_id', apartment.id)
        .is('request_id', null) // Apenas reviews públicas
        .order('created_at', { ascending: false })

      if (reviewsData) {
        setReviews(reviewsData as Review[])

        // Criar userMap
        const userIds = Array.from(new Set(reviewsData.map(r => r.user_id)))
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
      console.error('Erro ao carregar reviews:', error)
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-3xl font-bold mb-8">{buildingName}</h1>
        
        <ReviewsList
          reviews={reviews}
          userMap={userMap}
          currentUserId={currentUserId}
          onReviewDeleted={() => loadBuildingReviews()}
        />
      </div>
    </div>
  )
} 