'use client'

import { useState } from 'react'
import AmenitiesSelector from '@/components/AmenitiesSelector'
import Link from 'next/link'

interface ReviewFiltersProps {
  onFilterChange: (filters: {
    search?: string
    city?: string
    rating?: number | undefined
    orderBy?: 'recent' | 'rating' | 'likes'
    amenities?: string[]
  }) => void
}

export default function ReviewFilters({ onFilterChange }: ReviewFiltersProps) {
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('all')
  const [rating, setRating] = useState('all')
  const [orderBy, setOrderBy] = useState('recent')
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  const handleChange = (
    type: 'search' | 'city' | 'rating' | 'orderBy' | 'amenities',
    value: any
  ) => {
    if (type === 'search') setSearch(value)
    if (type === 'city') setCity(value)
    if (type === 'rating') setRating(value)
    if (type === 'orderBy') setOrderBy(value)
    if (type === 'amenities') setSelectedAmenities(value)

    onFilterChange({
      search: type === 'search' ? value : search,
      city: type === 'city' ? (value === 'all' ? undefined : value) : (city === 'all' ? undefined : city),
      rating: type === 'rating' ? (value === 'all' ? undefined : Number(value)) : (rating === 'all' ? undefined : Number(rating)),
      orderBy: type === 'orderBy' ? value as 'recent' | 'rating' | 'likes' : orderBy as 'recent' | 'rating' | 'likes',
      amenities: type === 'amenities' ? value : selectedAmenities
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      {/* Campo de busca */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nome do prédio, endereço ou bairro..."
          value={search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Grid de filtros mais responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Cidade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cidade
          </label>
          <select
            value={city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Todas as cidades</option>
            <option value="São Paulo">São Paulo</option>
            <option value="São Bernardo do Campo">São Bernardo do Campo</option>
            <option value="Santo André">Santo André</option>
            <option value="São Caetano do Sul">São Caetano do Sul</option>
          </select>
        </div>

        {/* Avaliação mínima */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avaliação mínima
          </label>
          <select
            value={rating}
            onChange={(e) => handleChange('rating', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Todas</option>
            <option value="5">5 estrelas</option>
            <option value="4">4+ estrelas</option>
            <option value="3">3+ estrelas</option>
            <option value="2">2+ estrelas</option>
            <option value="1">1+ estrela</option>
          </select>
        </div>

        {/* Ordenar por */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por
          </label>
          <select
            value={orderBy}
            onChange={(e) => handleChange('orderBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="recent">Mais recentes</option>
            <option value="rating">Melhor avaliação</option>
            <option value="likes">Mais curtidas</option>
          </select>
        </div>
      </div>

      {/* Amenidades com melhor espaçamento */}
      <div className="mt-6">
        <AmenitiesSelector
          selectedAmenities={selectedAmenities}
          onChange={(amenities) => handleChange('amenities', amenities)}
        />
      </div>
    </div>
  )
} 