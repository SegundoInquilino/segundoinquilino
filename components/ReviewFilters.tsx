'use client'

import { useState, useEffect } from 'react'

interface ReviewFiltersProps {
  cities: string[]
  onFilterChange: (filters: {
    searchTerm: string
    city: string
    minRating: number
    sortBy: 'recent' | 'rating' | 'likes'
    propertyType: string
  }) => void
}

export default function ReviewFilters({ cities, onFilterChange }: ReviewFiltersProps) {
  const [filters, setFilters] = useState({
    searchTerm: '',
    city: '',
    minRating: 0,
    sortBy: 'recent',
    propertyType: ''
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFilters({
      ...filters,
      searchTerm: value
    })
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onFilterChange(filters)
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [filters, onFilterChange])

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Buscar localização
        </label>
        <div className="relative">
          <input
            type="text"
            id="search"
            value={filters.searchTerm}
            onChange={handleSearchChange}
            placeholder="Digite rua, bairro, cidade ou estado..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Ex: "Avenida Paulista", "Jardins, São Paulo" ou "Centro"
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cidade
          </label>
          <select
            value={filters.city}
            onChange={(e) => {
              const newFilters = {
                ...filters,
                city: e.target.value
              }
              setFilters(newFilters)
            }}
            className="w-full h-11 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          >
            <option value="">Todas as cidades</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avaliação mínima
          </label>
          <select
            value={filters.minRating}
            onChange={(e) => {
              const newFilters = {
                ...filters,
                minRating: Number(e.target.value)
              }
              setFilters(newFilters)
            }}
            className="w-full h-11 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          >
            <option value="">Todas</option>
            <option value="5">5 estrelas</option>
            <option value="4">4+ estrelas</option>
            <option value="3">3+ estrelas</option>
            <option value="2">2+ estrelas</option>
            <option value="1">1+ estrela</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => {
              const newFilters = {
                ...filters,
                sortBy: e.target.value
              }
              setFilters(newFilters)
            }}
            className="w-full h-11 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          >
            <option value="recent">Mais recentes</option>
            <option value="rating">Melhor avaliação</option>
            <option value="likes">Mais curtidas</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Imóvel
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => {
              const newFilters = {
                ...filters,
                propertyType: e.target.value
              }
              setFilters(newFilters)
              onFilterChange(newFilters)
            }}
            className="w-full h-11 rounded-lg border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          >
            <option value="">Todos</option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
          </select>
        </div>
      </div>
    </div>
  )
} 