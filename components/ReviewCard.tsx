'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import ReviewModal from './ReviewModal'
import type { Review } from '@/types/review'
import { AMENITIES } from '@/types/amenities'
import StarRating from './StarRating'

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
  layout = 'grid'
}: ReviewCardProps) {
  return (
    <div 
      onClick={onClick}
      className="p-4 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-medium">
              {username ? username[0].toUpperCase() : 'U'}
            </span>
          </div>
          <div>
            <div className="font-medium">{username || 'Usuário'}</div>
            <div className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(review.created_at), {
                addSuffix: true,
                locale: ptBR
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <StarRating rating={review.rating} />
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-3">
        {review.comment}
      </p>

      {/* Amenidades */}
      <div className="flex flex-wrap gap-2 mt-2">
        {review.amenities?.map((amenity, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
          >
            {amenity}
          </span>
        ))}
      </div>
    </div>
  )
} 