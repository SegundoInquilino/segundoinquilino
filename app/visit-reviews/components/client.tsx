'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import VisitReviewsList from '@/components/VisitReviewsList'
import Link from 'next/link'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { VisitReview } from '@/types/visit-review'
import VisitReviewModal from '@/components/VisitReviewModal'

interface VisitReviewsClientProps {
  initialReviews: (VisitReview & {
    profiles: {
      username: string
    }
  })[]
}

export default function VisitReviewsClient({ initialReviews }: VisitReviewsClientProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedReview, setSelectedReview] = useState<VisitReview | null>(null)
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const reviewId = searchParams.get('review')
    if (reviewId) {
      const review = initialReviews.find(r => r.id === reviewId)
      if (review) {
        setSelectedReview(review)
      }
    }
  }, [searchParams, initialReviews])

  // Atualizar a lógica de filtragem para incluir a origem
  const filteredReviews = initialReviews.filter(review => {
    const searchLower = searchTerm.toLowerCase()
    
    // Normalizar o texto da origem para exibição
    const sourceDisplay = 
      review.source === 'quintoandar' ? 'Quinto Andar' :
      review.source === 'imovelweb' ? 'ImovelWeb' :
      review.source === 'vivareal' ? 'Viva Real' :
      review.source === 'zap' ? 'Zap Imóveis' :
      review.source === 'other' ? 'Outro' :
      review.source

    return (
      review.address.toLowerCase().includes(searchLower) ||
      (review.building_name && review.building_name.toLowerCase().includes(searchLower)) ||
      sourceDisplay.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Reviews de Visitas
        </h1>
        <Link
          href="/visit-reviews/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
        >
          Nova Review de Visita
        </Link>
      </div>

      {/* Campo de busca */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por endereço, nome do prédio ou origem da visita..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
          />
        </div>
      </div>
      
      {/* Lista de reviews */}
      <div className="mt-8">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm 
                ? 'Nenhuma review encontrada para esta busca.'
                : 'Nenhuma review de visita encontrada.'}
            </p>
          </div>
        ) : (
          <VisitReviewsList reviews={filteredReviews} />
        )}
      </div>

      {selectedReview && (
        <VisitReviewModal
          review={selectedReview}
          isOpen={!!selectedReview}
          onClose={() => {
            setSelectedReview(null)
            // Remove o parâmetro da URL ao fechar o modal
            window.history.replaceState({}, '', '/visit-reviews')
          }}
        />
      )}
    </div>
  )
} 