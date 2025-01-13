'use client'

import Link from 'next/link'
import { StarRating } from '@/components/ui/star-rating'

interface BuildingsSummary {
  building_name: string
  address: string
  neighborhood: string
  city: string
  reviews_count: number
  average_rating: number
}

interface BuildingsListProps {
  buildings: BuildingsSummary[]
}

export default function BuildingsList({ buildings }: BuildingsListProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Prédios Avaliados
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map((building) => (
            <Link
              key={building.building_name}
              href={`/buildings/${encodeURIComponent(building.building_name)}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {building.building_name}
                </h2>
                <div className="text-gray-600 mb-4">
                  <p className="line-clamp-1">{building.address}</p>
                  <p>{building.neighborhood}, {building.city}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating rating={building.average_rating} size="sm" />
                    <span className="text-sm text-gray-600">
                      ({building.reviews_count} {building.reviews_count === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 