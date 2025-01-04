'use client'

import { useState } from 'react'

interface ReviewFiltersProps {
  onFilterChange: (filters: {
    search?: string
    city?: string
    rating?: number
    orderBy?: 'recent' | 'rating' | 'likes'
  }) => void
}

export default function ReviewFilters({ onFilterChange }: ReviewFiltersProps) {
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('all')
  const [rating, setRating] = useState('all')
  const [orderBy, setOrderBy] = useState('recent')

  const handleChange = (
    type: 'search' | 'city' | 'rating' | 'orderBy',
    value: string
  ) => {
    if (type === 'search') setSearch(value)
    if (type === 'city') setCity(value)
    if (type === 'rating') setRating(value)
    if (type === 'orderBy') setOrderBy(value)

    onFilterChange({
      search: type === 'search' ? value : search,
      city: type === 'city' ? (value === 'all' ? undefined : value) : (city === 'all' ? undefined : city),
      rating: type === 'rating' ? (value === 'all' ? undefined : Number(value)) : (rating === 'all' ? undefined : Number(rating)),
      orderBy: type === 'orderBy' ? value as 'recent' | 'rating' | 'likes' : orderBy as 'recent' | 'rating' | 'likes'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Buscar localização */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar localização
        </label>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Avenida dos Estados"
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </div>
  )
} 