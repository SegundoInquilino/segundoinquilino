'use client'

import { VisitReview } from '@/types/review'
import { useState } from 'react'
import { StarIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import { MapPinIcon, ShareIcon, TrashIcon, LinkIcon } from '@heroicons/react/24/outline'
import VisitReviewModal from './VisitReviewModal'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase-client'
import toast from 'react-hot-toast'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Categorias de avaliação com labels
const RATING_CATEGORIES = [
  {
    id: 'location',
    label: 'Localização'
  },
  {
    id: 'condition',
    label: 'Estado do Imóvel'
  },
  {
    id: 'rooms',
    label: 'Quartos'
  },
  {
    id: 'neighborhood',
    label: 'Vizinhança'
  },
  {
    id: 'amenities',
    label: 'Comodidades'
  },
  {
    id: 'renovation',
    label: 'Necessidade de Reformas'
  },
  {
    id: 'cost_benefit',
    label: 'Custo-Benefício'
  }
] as const

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
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 sm:p-6 space-y-4">
        {/* Header do card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-lg">
                {review.profile?.username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-900">
                {review.profile?.username || 'Usuário anônimo'}
              </span>
              <span className="block text-sm text-gray-500">
                {formatDistanceToNow(new Date(review.created_at), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center px-3 py-1 bg-yellow-50 rounded-lg">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="ml-1.5 font-semibold text-gray-700">
                {averageRating.toFixed(1)}
              </span>
            </div>
            {currentUserId === review.user_id && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Conteúdo do card */}
        <div className="space-y-4">
          {/* Endereço */}
          <div className="flex items-start gap-3">
            <MapPinIcon className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <span className="text-gray-600 text-sm sm:text-base">
              {review.full_address}
            </span>
          </div>

          {/* Preview das avaliações */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {Object.entries(review.ratings).slice(0, 3).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-2 rounded-lg">
                <div className="font-medium text-gray-700">
                  {RATING_CATEGORIES.find(cat => cat.id === key)?.label}
                </div>
                <div className="flex items-center mt-1">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="ml-1 text-gray-600">{value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Botão de ver mais */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-4 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Ver avaliação completa
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <VisitReviewModal
        review={review}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isOwner={currentUserId === review.user_id}
        onDelete={handleDelete}
      />
    </>
  )
} 