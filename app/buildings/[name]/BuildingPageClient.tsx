'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import ReviewCardWrapper from '@/components/ReviewCardWrapper'
import { useAuth } from '@/contexts/AuthContext'
import type { Review } from '@/types/review'

interface BuildingPageClientProps {
  buildingName: string
}

export default function BuildingPageClient({ buildingName }: BuildingPageClientProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [buildingInfo, setBuildingInfo] = useState<{
    address: string
    neighborhood: string
    city: string
  } | null>(null)
  const [userMap, setUserMap] = useState<Record<string, string>>({})
  const supabase = createClient()
  const { currentUserId } = useAuth()

  useEffect(() => {
    const loadBuildingReviews = async () => {
      try {
        // Buscando reviews pelo apartment_id
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
          .eq('apartments.building_name', buildingName)

        if (reviewsError) {
          console.error('Erro ao carregar reviews:', reviewsError.message)
          return
        }

        if (reviewsData && reviewsData.length > 0) {
          const firstReview = reviewsData[0]
          const apartmentInfo = firstReview.apartments
          setBuildingInfo({
            address: apartmentInfo.address,
            neighborhood: apartmentInfo.neighborhood,
            city: apartmentInfo.city
          })

          // Carregando perfis com mais informações
          const userIds = Array.from(new Set(reviewsData.map(r => r.user_id)))
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, full_name')
            .in('id', userIds)

          if (profilesError) {
            console.error('Erro ao carregar perfis:', profilesError.message)
          } else {
            const newUserMap: Record<string, string> = {}
            const reviewsWithProfiles = reviewsData.map(review => ({
              ...review,
              profiles: profiles?.find(p => p.id === review.user_id),
              likes_count: 0 // ou buscar da tabela de likes se existir
            }))
            
            profiles?.forEach(profile => {
              newUserMap[profile.id] = profile.username
            })
            setUserMap(newUserMap)
            setReviews(reviewsWithProfiles)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBuildingReviews()
  }, [buildingName])

  const handleDeleteReview = (deletedReviewId: string) => {
    setReviews(prevReviews => prevReviews.filter(review => review.id !== deletedReviewId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {buildingName}
          </h1>
          {buildingInfo && (
            <div className="text-gray-600">
              <p>{buildingInfo.address}</p>
              <p>{buildingInfo.neighborhood}, {buildingInfo.city}</p>
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Reviews ({reviews.length})
          </h2>
          {reviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Nenhuma review ainda
              </h3>
              <p className="text-gray-600">
                Seja o primeiro a avaliar este prédio!
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
                  onDeleteReview={handleDeleteReview}
                  username={userMap[review.user_id] || 'Usuário'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 