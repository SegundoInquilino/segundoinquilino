'use client'

import { VisitReview } from '@/types/review'
import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { MapPinIcon, ShareIcon, TrashIcon, LinkIcon } from '@heroicons/react/24/outline'
import VisitReviewModal from './VisitReviewModal'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase-client'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface VisitReviewCardProps {
  review: VisitReview & {
    profile?: {
      username?: string
      full_name?: string
      avatar_url?: string
    } | null
  }
}

const getVisitSourceLabel = (source: string) => {
  const sources = {
    imobiliaria: 'Imobiliária',
    corretor: 'Corretor',
    proprietario: 'Proprietário',
    site: 'Site (QuintoAndar, ImovelWeb, EmCasa, etc)',
    outro: 'Outro'
  }
  return sources[source as keyof typeof sources] || source
}

const getPropertyTypeLabel = (type: string) => {
  const types = {
    house: 'Casa',
    apartment: 'Apartamento'
  }
  return types[type as keyof typeof types] || type
}

export default function VisitReviewCard({ review }: VisitReviewCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { currentUserId } = useAuth()
  const supabase = createClient()

  // Calcular média das avaliações
  const averageRating = Object.values(review.ratings).reduce((a, b) => a + b, 0) / 7

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Review de Visita - Segundo Inquilino',
        text: `Confira esta avaliação de visita em ${review.address}`,
        url: window.location.href
      })
    } catch (error) {
      toast.error('Erro ao compartilhar')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta avaliação?')) {
      return
    }

    setIsDeleting(true)
    try {
      // Primeiro deletar as imagens do storage se houver
      if (review.images?.length > 0) {
        for (const imageUrl of review.images) {
          const path = imageUrl.split('/').pop() // Pegar o nome do arquivo da URL
          if (path) {
            await supabase.storage
              .from('reviews_images')
              .remove([`${currentUserId}/${path}`])
          }
        }
      }

      // Depois deletar a review
      const { error } = await supabase
        .from('visit_reviews')
        .delete()
        .eq('id', review.id)

      if (error) throw error

      toast.success('Avaliação excluída com sucesso')
      // Recarregar a página para atualizar a lista
      window.location.reload()
    } catch (error) {
      console.error('Erro ao excluir review:', error)
      toast.error('Erro ao excluir avaliação')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAddressClick = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(review.full_address)}`)
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
        {/* Header com usuário e nota média */}
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-medium text-lg">
              {review.profile?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {review.profile?.username || 'Usuário anônimo'}
              </h3>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(review.created_at), { 
                  addSuffix: true,
                  locale: ptBR 
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center px-3 py-1 bg-yellow-50 rounded-lg">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 font-semibold text-gray-700">
              {averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Endereço clicável */}
        <div className="space-y-3 mb-4">
          <button
            onClick={handleAddressClick}
            className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors mb-4 group"
          >
            <MapPinIcon className="h-5 w-5 text-gray-400 group-hover:text-purple-500 flex-shrink-0" />
            <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 line-clamp-1 text-left">
              {review.full_address}
            </span>
          </button>

          {/* Fonte da visita e tipo do imóvel */}
          <div className="flex items-center space-x-2 px-1 flex-wrap gap-y-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              {getVisitSourceLabel(review.visit_source)}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {getPropertyTypeLabel(review.property_type)}
            </span>
            {review.listing_url && (
              <a
                href={review.listing_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 flex items-center text-sm"
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                <span>Ver anúncio</span>
              </a>
            )}
          </div>
        </div>

        {/* Preview do comentário */}
        <div className="mb-6">
          <p className="text-gray-600 line-clamp-3 leading-relaxed">
            {review.comments}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-3 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors flex items-center"
          >
            Ver avaliação completa
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-100 -mx-6 mb-4" />

        {/* Ações */}
        <div className="flex justify-end space-x-2 px-2">
          <button
            onClick={handleShare}
            className="p-2 text-gray-400 hover:text-purple-600 rounded-full hover:bg-purple-50 transition-all"
            title="Compartilhar"
          >
            <ShareIcon className="h-5 w-5" />
          </button>
          {currentUserId === review.user_id && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Excluir"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <VisitReviewModal
        review={review}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
} 