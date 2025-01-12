'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import ReviewComments from './ReviewComments'
import type { Review } from '@/types/review'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AMENITIES } from '@/types/amenities'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const getInitials = (name?: string) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

type ReviewModalProps = {
  review: {
    id: string
    rating: number
    comment: string
    created_at: string
    user_id: string
    likes_count: { count: number } | number
    images?: string[]
    amenities?: string[]
    apartments: {
      id: string
      address: string
      city: string
      state: string
      zip_code: string
      neighborhood: string
    }
    profiles?: {
      avatar_url?: string
      avatar_fallback_class?: string
      full_name?: string
    }
  }
  username: string
  currentUserId?: string | null
  userMap: Record<string, string>
  selectedCommentId?: string | null
  isDeleting?: boolean
  onDelete?: () => Promise<void>
  onClose?: () => void
  onDeleteSuccess?: () => void
}

export default function ReviewModal({
  review,
  username,
  currentUserId,
  userMap,
  selectedCommentId,
  isDeleting,
  onDelete,
  onClose,
  onDeleteSuccess
}: ReviewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const supabase = createClient()

  const handlePrevImage = () => {
    if (!review.images?.length) return
    setCurrentImageIndex((prev) => 
      prev === 0 ? review.images!.length - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    if (!review.images?.length) return
    setCurrentImageIndex((prev) => 
      prev === review.images!.length - 1 ? 0 : prev + 1
    )
  }

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', review.id)

      if (error) throw error

      // Primeiro emitir o evento
      const event = new CustomEvent('reviewDeleted', {
        detail: { reviewId: review.id }
      })
      window.dispatchEvent(event)

      // Depois fechar o modal
      if (onClose) onClose()
      if (onDeleteSuccess) onDeleteSuccess()

    } catch (error) {
      console.error('Erro ao deletar review:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {review.apartments.address}
          </h2>
          <div className="space-y-1">
            <p className="text-secondary-600">
              {review.apartments.neighborhood}, {review.apartments.city}
            </p>
            <p className="text-gray-500 text-sm">
              {review.apartments.state} - {review.apartments.zip_code}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 text-2xl">
            {'★'.repeat(review.rating)}
          </span>
          <span className="text-gray-300 text-2xl">
            {'★'.repeat(5 - review.rating)}
          </span>
        </div>
      </div>

      {/* Galeria de imagens */}
      {review.images && review.images.length > 0 && (
        <div className="relative">
          <div className="aspect-video rounded-lg overflow-hidden">
            <img
              src={review.images[currentImageIndex]}
              alt={`Imagem ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {review.images.length > 1 && (
            <>
              {/* Botão Anterior */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Botão Próximo */}
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Indicadores */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {review.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex 
                        ? 'bg-white' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Amenidades */}
      {review.amenities && review.amenities.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Comodidades e Características
          </h3>
          <div className="flex flex-wrap gap-3">
            {review.amenities.map((amenityId) => {
              const amenity = AMENITIES.find(a => a.id === amenityId)
              if (!amenity) return null
              
              return (
                <span 
                  key={amenityId}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white text-purple-700 border border-purple-100 shadow-sm"
                >
                  <span className="mr-2">{amenity.icon}</span>
                  {amenity.label}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Conteúdo da Review */}
      <div className="space-y-6">
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {review.comment}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Avatar className="w-10 h-10">
              <AvatarImage src={review.profiles?.avatar_url || ''} />
              <AvatarFallback className={review.profiles?.avatar_fallback_class || "bg-black text-white font-bold"}>
                {getInitials(review.profiles?.full_name || userMap[review.user_id] || 'Usuário')}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-gray-900">{username}</span>
          </div>
          <time>
            {formatDistanceToNow(new Date(review.created_at), {
              addSuffix: true,
              locale: ptBR
            })}
          </time>
        </div>
      </div>

      {/* Seção de Comentários */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          Comentários
        </h3>
        <div className="sticky bottom-0 bg-white pt-2 pb-4">
          <ReviewComments
            reviewId={review.id}
            currentUserId={currentUserId}
            userMap={userMap}
            selectedCommentId={selectedCommentId}
          />
        </div>
      </div>

      {/* Botões de ação */}
      {currentUserId === review.user_id && (
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Fechar
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 rounded-lg transition-colors"
          >
            {isDeleting ? 'Deletando...' : 'Deletar Review'}
          </button>
        </div>
      )}
    </div>
  )
} 