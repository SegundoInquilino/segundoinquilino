'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ReviewModal from './ReviewModal'
import type { Review } from '@/types/review'

interface ReviewCardProps {
  review: Review
  username: string
  currentUserId?: string | null
  userMap: Record<string, string>
  onClick?: () => void
  layout?: 'grid' | 'square'
}

export default function ReviewCard({
  review,
  username,
  currentUserId,
  userMap,
  onClick,
  layout
}: ReviewCardProps) {
  const [showModal, setShowModal] = useState(false)
  const { address, city, state, zip_code, neighborhood } = review.apartments

  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer ${layout === 'square' ? 'h-full' : ''}`}
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{address}</h2>
          <div className="space-y-1">
            <p className="text-secondary-600">
              {neighborhood ? `${neighborhood}, ` : ''}{city}
            </p>
            <p className="text-gray-500 text-sm">
              {state}
              {state && zip_code ? ' - ' : ''}
              {zip_code}
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-primary-600">
                Por: {username}
              </span>
              <div className="flex items-center">
                <span className="text-yellow-400 text-lg">
                  {'★'.repeat(review.rating)}
                </span>
                <span className="text-gray-300 text-lg">
                  {'★'.repeat(5 - review.rating)}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-2">
              {review.comment}
            </p>
            <p className="text-primary-600 text-sm hover:text-primary-700">
              Clique para ver mais...
            </p>
            
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-400 ml-auto">
                {formatDistanceToNow(new Date(review.created_at), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ReviewModal
          review={review}
          username={username}
          currentUserId={currentUserId}
          userMap={userMap}
        />
      )}
    </div>
  )
} 