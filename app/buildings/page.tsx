'use client'

import { createClient } from '@/utils/supabase-client'
import BuildingsList from './BuildingsList'
import { useEffect, useState } from 'react'

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
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          apartments!inner (
            building_name,
            address,
            neighborhood,
            city
          )
        `)

      if (error) {
        console.error('Erro ao carregar prédios:', error.message)
        return
      }

      const buildingsMap = data.reduce<Record<string, BuildingSummary>>((acc, review: any) => {
        const building = review.apartments
        if (!building?.building_name) return acc

        if (!acc[building.building_name]) {
          acc[building.building_name] = {
            building_name: building.building_name,
            address: building.address,
            neighborhood: building.neighborhood,
            city: building.city,
            reviews_count: 1,
            average_rating: 0
          }
        } else {
          acc[building.building_name].reviews_count++
        }

        return acc
      }, {})

      setBuildings(Object.values(buildingsMap))
      setLoading(false)
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