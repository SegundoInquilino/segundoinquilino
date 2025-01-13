'use client'

import Link from 'next/link'
import { useState } from 'react'
import { StarRating } from '@/components/ui/star-rating'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

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
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBuildings = buildings.filter(building => {
    const searchLower = searchTerm.toLowerCase()
    return (
      building.building_name.toLowerCase().includes(searchLower) ||
      building.address.toLowerCase().includes(searchLower) ||
      building.neighborhood.toLowerCase().includes(searchLower) ||
      building.city.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Prédios Avaliados
        </h1>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, endereço ou bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                         focus:ring-purple-500 focus:border-purple-500 
                         bg-white shadow-sm"
            />
          </div>
        </div>

        {filteredBuildings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Nenhum prédio encontrado
            </h3>
            <p className="text-gray-600">
              Tente buscar com outro termo
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuildings.map((building) => (
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
        )}
      </div>
    </div>
  )
} 