'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import ReviewModal from './ReviewModal'
import type { Review } from '@/types/review'
import { AMENITIES } from '@/types/amenities'

interface ReviewCardProps {
  review: {
    id: string
    rating: number
    comment: string
    created_at: string
    user_id: string
    likes_count: number | { count: number }
    images?: string[]
    apartments: {
      id: string
      address: string
      city: string
      state: string
      zip_code: string
      neighborhood: string
    }
    amenities?: string[]
  }
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
  const [isLiking, setIsLiking] = useState(false)
  const [showModal, setShowModal] = useState(false)

  if (!review.apartments) return null

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!currentUserId || isLiking) return
    setIsLiking(true)

    try {
      await supabase
        .from('review_likes')
        .upsert({ 
          review_id: review.id, 
          user_id: currentUserId 
        })
    } catch (error) {
      console.error('Erro ao dar like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const getLikesCount = () => {
    if (typeof review.likes_count === 'number') {
      return review.likes_count
    }
    return review.likes_count?.count || 0
  }

  const { address, city, state, zip_code, neighborhood } = review.apartments

  const likesCount = typeof review.likes_count === 'object' 
    ? review.likes_count.count 
    : review.likes_count || 0

  return (
    <>
      <div 
        onClick={onClick}
        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      >
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
            
            <div className="mt-4 flex items-center gap-6 text-sm">
              <button 
                onClick={handleLike}
                disabled={isLiking || !currentUserId}
                className="flex items-center gap-2 text-secondary-600 hover:text-secondary-700 disabled:opacity-50 transition-colors"
              >
                <span className="text-lg">❤️</span>
                <span className="font-medium">{getLikesCount()}</span>
              </button>

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

      {review.amenities && review.amenities.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {review.amenities.map(amenityId => {
              const amenity = AMENITIES.find(a => a.id === amenityId)
              if (!amenity) return null
              
              return (
                <span
                  key={amenityId}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  {amenity.label}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
} 