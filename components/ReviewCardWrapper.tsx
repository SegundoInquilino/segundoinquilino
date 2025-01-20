'use client'

import { useState } from 'react'
import ReviewCard from './ReviewCard'
import type { Review } from '@/types/review'
import { useAuth } from '@/contexts/AuthContext'

interface ReviewCardWrapperProps {
  review: Review
  username: string
  currentUserId: string | null
  onReviewDeleted?: (reviewId: string) => void
  layout?: 'square' | 'list'
  userMap: Record<string, string>
}

export default function ReviewCardWrapper({
  review,
  username,
  currentUserId,
  layout,
  userMap,
  onReviewDeleted
}: ReviewCardWrapperProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div onClick={() => setShowModal(true)}>
        <ReviewCard
          review={review}
          username={username}
          currentUserId={currentUserId}
          layout={layout}
          userMap={userMap}
          onDelete={onReviewDeleted}
          isModal={false}
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg">
            <button
              onClick={() => setShowModal(false)}
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
              onDelete={onReviewDeleted}
            />
          </div>
        </div>
      )}
    </>
  )
} 