'use client'

import { createClient } from '@/utils/supabase-client'
import BuildingsList from './BuildingsList'
import { useEffect, useState } from 'react'
import StarRating from '@/components/StarRating'

interface BuildingSummary {
  building_name: string
  address: string
  neighborhood: string
  city: string
  reviews_count: number
  average_rating: number
}

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<BuildingSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBuildings = async () => {
      const supabase = createClient()
      
      try {
        const { data: buildings } = await supabase
          .from('apartments')
          .select(`
            *,
            reviews (
              rating
            )
          `)
          .eq('property_type', 'apartment')
          .order('building_name')

        if (buildings) {
          // Filtrar apenas prédios com reviews e calcular média
          const buildingsWithReviews = buildings
            .filter(building => building.reviews && building.reviews.length > 0)
            .map(building => ({
              ...building,
              avgRating: building.reviews.reduce((acc: number, review) => acc + review.rating, 0) / building.reviews.length,
              reviewsCount: building.reviews.length
            }))

          setBuildings(buildingsWithReviews)
        }
      } catch (error) {
        console.error('Erro ao carregar prédios:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBuildings()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    )
  }

  return <BuildingsList buildings={buildings} />
} 