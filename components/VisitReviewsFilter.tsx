'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface VisitReviewsFilterProps {
  onFilterChange: (filters: {
    search: string
    propertyType: string
    visitSource: string
  }) => void
}

export default function VisitReviewsFilter({ onFilterChange }: VisitReviewsFilterProps) {
  const [search, setSearch] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [visitSource, setVisitSource] = useState('')

  const handleChange = (
    field: 'search' | 'propertyType' | 'visitSource',
    value: string
  ) => {
    switch (field) {
      case 'search':
        setSearch(value)
        break
      case 'propertyType':
        setPropertyType(value)
        break
      case 'visitSource':
        setVisitSource(value)
        break
    }

    onFilterChange({
      search: field === 'search' ? value : search,
      propertyType: field === 'propertyType' ? value : propertyType,
      visitSource: field === 'visitSource' ? value : visitSource,
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="space-y-4">
        {/* Busca por endereço */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por endereço..."
            value={search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Filtro de tipo de imóvel */}
          <div className="flex-1 min-w-[200px]">
            <select
              value={propertyType}
              onChange={(e) => handleChange('propertyType', e.target.value)}
              className="block w-full border border-gray-200 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Tipo de imóvel</option>
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
            </select>
          </div>

          {/* Filtro de fonte da visita */}
          <div className="flex-1 min-w-[200px]">
            <select
              value={visitSource}
              onChange={(e) => handleChange('visitSource', e.target.value)}
              className="block w-full border border-gray-200 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Fonte da visita</option>
              <option value="imobiliaria">Imobiliária</option>
              <option value="corretor">Corretor</option>
              <option value="proprietario">Proprietário</option>
              <option value="site">Site</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
} 