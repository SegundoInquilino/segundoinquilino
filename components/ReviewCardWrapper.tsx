'use client'

import ReviewCard from './ReviewCard'
import { useState, useEffect } from 'react'
import ReviewModal from './ReviewModal'
import { createClientComponentClient } from '@/utils/supabase-client-component'
import { useRouter } from 'next/navigation'
import type { Review } from '@/types/review'
import { AMENITIES } from '@/types/amenities'

interface ReviewCardWrapperProps {
  review: Review
  username: string
  currentUserId?: string | null
  userMap: Record<string, string>
  isSelected?: boolean
  selectedCommentId?: string | null
  onClose?: () => void
  onReviewDeleted?: () => void
  layout?: 'grid' | 'square'
}

export default function ReviewCardWrapper({
  review,
  username,
  currentUserId,
  userMap,
  isSelected,
  selectedCommentId,
  onClose,
  onReviewDeleted,
  layout = 'grid'
}: ReviewCardWrapperProps) {
  const [showModal, setShowModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (isSelected) {
      setShowModal(true)
    }
  }, [isSelected])

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta review?')) return

    setIsDeleting(true)
    try {
      // Primeiro, deletar todas as notificações relacionadas
      const { error: notificationsError } = await supabase
        .from('notifications')
        .delete()
        .eq('review_id', review.id)

      if (notificationsError) throw notificationsError

      // Depois, deletar todos os comentários
      const { error: commentsError } = await supabase
        .from('review_comments')
        .delete()
        .eq('review_id', review.id)

      if (commentsError) throw commentsError

      // Deletar todos os likes
      const { error: likesError } = await supabase
        .from('review_likes')
        .delete()
        .eq('review_id', review.id)

      if (likesError) throw likesError

      // Finalmente, deletar a review
      const { error: reviewError } = await supabase
        .from('reviews')
        .delete()
        .eq('id', review.id)
        .eq('user_id', currentUserId)

      if (reviewError) throw reviewError

      // Redirecionar ou atualizar a lista
      router.refresh() // Atualiza os dados da página
      setShowModal(false)
      onReviewDeleted?.()
    } catch (error) {
      console.error('Erro ao deletar review:', error)
      alert('Erro ao deletar review. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Verificação de segurança para os dados necessários
  if (!review || !review.apartments) {
    return null
  }

  const propertyType = review.apartments?.property_type || 'apartment'
  const propertyIcon = propertyType === 'house' ? (
    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ) : (
    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow relative">
      <div className="relative">
        {review.images?.[0] && (
          <img
            src={review.images[0]}
            alt="Imóvel"
            className="w-full h-48 object-cover"
          />
        )}
        
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 shadow-md">
          {propertyIcon}
          <span className="text-sm font-medium text-primary-600">
            {propertyType === 'house' ? 'Casa' : 'Apartamento'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <ReviewCard
          review={{
            ...review,
            likes_count: typeof review.likes_count === 'object' 
              ? review.likes_count.count 
              : review.likes_count || 0,
            apartments: {
              ...review.apartments,
              property_type: propertyType
            }
          }}
          username={username}
          currentUserId={currentUserId}
          userMap={userMap}
          onClick={() => setShowModal(true)}
          layout="grid"
        />

        {/* Amenidades com ícones */}
        {review.amenities && review.amenities.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Comodidades:</h4>
            <div className="flex flex-wrap gap-2">
              {review.amenities.map((amenityId) => {
                const amenity = AMENITIES.find(a => a.id === amenityId)
                if (!amenity) return null
                
                return (
                  <span 
                    key={amenityId}
                    className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100"
                  >
                    <span className="mr-1">{amenity.icon}</span>
                    {amenity.label}
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6">
              <ReviewModal
                review={review}
                username={username}
                currentUserId={currentUserId}
                userMap={userMap}
                selectedCommentId={selectedCommentId}
                isDeleting={isDeleting}
                onDelete={handleDelete}
                onClose={() => setShowModal(false)}
                onDeleteSuccess={() => {
                  setShowModal(false)
                  onReviewDeleted?.()
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 