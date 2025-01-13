'use client'

import { useState } from 'react'
import ReviewCard from './ReviewCard'
import type { Review } from '@/types/review'
import { useAuth } from '@/contexts/AuthContext'

interface ReviewCardWrapperProps {
  review: Review
  layout?: 'grid' | 'square'
  onReviewDeleted?: () => void
  key?: string
  username?: string
  currentUserId?: string | null
  userMap?: Record<string, string>
  onDelete?: (reviewId: string) => void
}

export default function ReviewCardWrapper({ 
  review, 
  layout,
  onReviewDeleted,
  username,
  currentUserId: propCurrentUserId,
  userMap = {},
  onDelete
}: ReviewCardWrapperProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { currentUserId: authCurrentUserId } = useAuth()
  
  const currentUserId = propCurrentUserId || authCurrentUserId

  return (
    <>
      <ReviewCard
        review={review}
        currentUserId={currentUserId}
        onOpenModal={() => setIsModalOpen(true)}
        layout={layout}
        username={username}
        userMap={userMap}
        onDelete={onDelete}
      />
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <span className="sr-only">Fechar</span>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ReviewCard 
              review={review} 
              isModal 
              currentUserId={currentUserId}
              username={username}
              userMap={userMap}
              onDelete={onDelete}
            />
          </div>
        </div>
      )}
    </>
  )
} 