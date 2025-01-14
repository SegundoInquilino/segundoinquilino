'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import ReviewMap from '@/components/ReviewMap'

export default function MapPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            id,
            rating,
            comment,
            created_at,
            profiles!reviews_user_id_fkey ( 
              username,
              full_name
            ),
            apartments!reviews_apartment_id_fkey (
              id,
              building_name,
              address,
              neighborhood,
              city,
              state,
              latitude,
              longitude
            )
          `)
          .not('apartments.latitude', 'is', null)
          .not('apartments.longitude', 'is', null)

        if (error) {
          console.error('Erro Supabase:', error.message, error.details)
          setError('Erro ao carregar os dados. Por favor, tente novamente.')
          return
        }

        if (!data) {
          setReviews([])
          return
        }

        console.log('Reviews carregadas:', data) // Debug

        const formattedReviews = data
          .filter(review => review.apartments && review.apartments.latitude)
          .map(review => ({
            id: review.id,
            latitude: Number(review.apartments.latitude),
            longitude: Number(review.apartments.longitude),
            title: review.apartments.building_name || 'Sem nome',
            address: `${review.apartments.address || ''}, ${review.apartments.neighborhood || ''}`.trim(),
            rating: review.rating,
            comment: review.comment,
            author: review.profiles?.full_name || review.profiles?.username || 'Usuário',
            date: review.created_at
          }))

        console.log('Reviews formatadas:', formattedReviews) // Debug
        setReviews(formattedReviews)
      } catch (err) {
        console.error('Erro ao processar dados:', err)
        setError('Ocorreu um erro inesperado. Por favor, tente novamente.')
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Reviews no Mapa</h1>
        <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
          Carregando reviews...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Reviews no Mapa</h1>
        <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg text-red-600">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Reviews no Mapa</h1>
      {reviews.length > 0 ? (
        <ReviewMap reviews={reviews} />
      ) : (
        <div className="h-[600px] flex items-center justify-center bg-gray-50 rounded-lg">
          Nenhuma review encontrada com localização
        </div>
      )}
    </div>
  )
} 