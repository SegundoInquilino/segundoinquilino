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
import ImageModal from './ImageModal'
import { HomeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { 
  getReviewTitle, 
  getReviewLocation, 
  getReviewAddress,
  getReviewAuthor,
  getReviewSummary 
} from '@/utils/review'

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
  review: Review & {
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Avatar className="w-10 h-10">
            <AvatarImage src={review.profiles?.avatar_url || ''} />
            <AvatarFallback className="bg-black text-white font-bold">
              {getInitials(username || 'Usuário')}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-medium text-gray-900">
              {username || 'Usuário'}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(review.created_at), {
                addSuffix: true,
                locale: ptBR
              })}
            </p>
          </div>
        </div>

        <StarRating rating={review.rating} size="lg" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {review.apartments.property_type === 'house' ? (
            <HomeIcon className="w-5 h-5 text-gray-500" />
          ) : (
            <BuildingOfficeIcon className="w-5 h-5 text-gray-500" />
          )}
          <h3 className="text-xl font-bold text-gray-900">
            {review.apartments.building_name}
          </h3>
        </div>

        <div className="text-gray-600">
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${review.apartments.address}, ${review.apartments.neighborhood}, ${review.apartments.city} - ${review.apartments.state}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors flex items-center gap-2 group"
          >
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
              <svg 
                className="w-4 h-4 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span>{getReviewAddress(review)}</span>
          </a>
          <p className="text-gray-500 mt-1">{getReviewLocation(review)}</p>
        </div>

        {review.rental_source && (
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-gray-400">•</span>
            <span><span className="font-medium">Alugado via:</span> {review.rental_source}</span>
          </div>
        )}
      </div>

      {review.comment && (
        <div className="mt-8 space-y-4">
          <div className="inline-block">
            <h4 className="font-medium px-3 py-1 bg-black text-white rounded-lg text-sm">
              Comentário
            </h4>
          </div>
          <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
            {review.comment}
          </p>
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
              <div 
                key={index} 
                className="aspect-square relative rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image}
                  alt={`Foto ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover hover:opacity-90 transition-opacity"
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

      {selectedImage && (
        <ImageModal
          src={selectedImage}
          alt="Foto expandida"
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  )
} 