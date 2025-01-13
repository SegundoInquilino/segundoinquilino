'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import ReviewComments from './ReviewComments'
import type { Review } from '@/types/review'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AMENITIES } from '@/types/amenities'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { StarRating } from '@/components/ui/star-rating'

const getInitials = (name?: string) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (date: string) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: ptBR
  })
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
  userMap = {}
}: ReviewModalProps) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={review.profiles?.avatar_url || ''} />
            <AvatarFallback className={review.profiles?.avatar_fallback_class}>
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {username}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(review.created_at)}
            </p>
          </div>
        </div>

        <StarRating rating={review.rating} size="lg" />
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-2">
          <p>{review.apartments.address}</p>
          <p>
            {review.apartments.neighborhood}, {review.apartments.city} - {review.apartments.state}
          </p>
          <p>{review.apartments.zip_code}</p>
        </div>
      </div>

      {review.comment && (
        <div className="mb-6">
          <h4 className="font-medium mb-2">Comentário</h4>
          <p className="text-gray-600 whitespace-pre-wrap">{review.comment}</p>
        </div>
      )}

      {review.amenities && review.amenities.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-2">Amenidades</h4>
          <div className="flex flex-wrap gap-2">
            {review.amenities.map((amenityId: string) => {
              const amenity = AMENITIES.find(a => a.id === amenityId)
              if (!amenity) return null
              
              return (
                <span 
                  key={amenityId}
                  className="inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                >
                  <span className="mr-1">{amenity.icon}</span>
                  {amenity.label}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {review.images && review.images.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-2">Fotos</h4>
          <div className="grid grid-cols-2 gap-2">
            {review.images.map((image, index) => (
              <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Foto ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        <h4 className="font-medium mb-4">Comentários</h4>
        <ReviewComments reviewId={review.id} currentUserId={currentUserId} userMap={userMap} />
      </div>
    </div>
  )
} 