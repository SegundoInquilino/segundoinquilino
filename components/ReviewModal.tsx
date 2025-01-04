'use client'

import { useState } from 'react'
import ReviewComments from './ReviewComments'

type ReviewModalProps = {
  review: {
    id: string
    rating: number
    comment: string
    created_at: string
    user_id: string
    likes_count: { count: number } | number
    images?: string[]
    apartments: {
      id: string
      address: string
      city: string
      state: string
      zip_code: string
    }
  }
  username: string
  currentUserId?: string | null
  userMap: Record<string, string>
  selectedCommentId?: string | null
  isDeleting?: boolean
  onDelete?: () => void
}

export default function ReviewModal({
  review,
  username,
  currentUserId,
  userMap,
  selectedCommentId,
  isDeleting,
  onDelete
}: ReviewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{review.apartments.address}</h2>
        <p className="text-gray-600">{review.apartments.city}, {review.apartments.state}</p>
      </div>

      {/* Avaliação */}
      <div className="flex items-center space-x-2">
        <div className="text-yellow-400 text-xl">
          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
        </div>
        <span className="text-gray-600">por {username}</span>
      </div>

      {/* Carrossel de Imagens */}
      {review.images && review.images.length > 0 && (
        <div className="space-y-4">
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={review.images[currentImageIndex]}
                alt={`Foto ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Botões de navegação */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Miniaturas */}
          <div className="flex gap-2 overflow-x-auto py-2">
            {review.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`
                  flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all
                  ${currentImageIndex === index 
                    ? 'ring-2 ring-primary-500 ring-offset-2' 
                    : 'opacity-70 hover:opacity-100'
                  }
                `}
              >
                <img
                  src={image}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comentário */}
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
      </div>

      {/* Seção de comentários */}
      <div className="mt-8 border-t pt-6">
        <ReviewComments
          reviewId={review.id}
          review={review}
          currentUserId={currentUserId}
          userMap={userMap}
          highlightedCommentId={selectedCommentId}
        />
      </div>

      {/* Botão de deletar */}
      {currentUserId === review.user_id && (
        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-end">
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                />
              </svg>
              {isDeleting ? 'Deletando...' : 'Deletar Review'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 