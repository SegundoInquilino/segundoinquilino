'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ReviewModal from './ReviewModal'
import type { Review } from '@/types/review'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/ui/star-rating'
import AuthModal from './AuthModal'
import { AMENITIES } from '@/types/amenities'
import { 
  getReviewTitle, 
  getReviewLocation, 
  getReviewAddress,
  getReviewAuthor,
  getReviewSummary 
} from '@/utils/review'

// Funções auxiliares
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

interface ReviewCardProps {
  review: Review
  currentUserId?: string | null
  layout?: 'grid' | 'square'
  isModal?: boolean
  onOpenModal?: () => void
  username?: string
  userMap?: Record<string, string>
}

export default function ReviewCard({
  review,
  currentUserId,
  layout,
  isModal = false,
  onOpenModal,
  username,
  userMap = {}
}: ReviewCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { currentUserId: authUserId } = useAuth()
  const router = useRouter()

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!authUserId) {
      setShowAuthModal(true)
    } else if (onOpenModal) {
      onOpenModal()
    }
  }

  return (
    <>
      <div className={`w-full ${isModal ? 'p-6' : 'p-4'} bg-white rounded-lg shadow-md`}>
        {!isModal ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={review.profiles?.avatar_url || ''} />
                  <AvatarFallback className="bg-black text-white font-bold">
                    {getInitials(getReviewAuthor(review, userMap))}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm">
                    {getReviewAuthor(review, userMap)}
                  </h3>
                  <p className="text-xs text-gray-500">{formatDate(review.created_at)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} size="sm" />
              </div>
            </div>

            <h2 className="font-semibold mb-1 line-clamp-1">
              {getReviewTitle(review)}
            </h2>
            
            <div className="mb-3 text-sm text-gray-600">
              <p className="line-clamp-1">{getReviewAddress(review)}</p>
              <p className="text-gray-500">{getReviewLocation(review)}</p>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {getReviewSummary(review)}
            </p>

            {review.amenities && review.amenities.length > 0 && (
              <div className="mb-3">
                <div className="flex flex-wrap gap-2">
                  {review.amenities.slice(0, 3).map((amenityId: string) => {
                    const amenity = AMENITIES.find(a => a.id === amenityId)
                    if (!amenity) return null
                    
                    return (
                      <span 
                        key={amenityId}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        <span className="mr-1">{amenity.icon}</span>
                        {amenity.label}
                      </span>
                    )
                  })}
                  {review.amenities.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      +{review.amenities.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={handleCardClick}>
                Ver mais
              </Button>
            </div>
          </>
        ) : (
          <ReviewModal
            review={{
              ...review,
              profiles: {
                ...review.profiles,
                avatar_fallback_class: "bg-black text-white font-bold"
              }
            }}
            username={username || review.profiles?.full_name || userMap[review.user_id] || 'Usuário'}
            currentUserId={currentUserId}
            userMap={userMap}
          />
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  )
} 