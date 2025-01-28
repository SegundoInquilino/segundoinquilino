'use client'

import ReviewCardWrapper from './ReviewCardWrapper'
import type { Review } from '@/types/review'

interface ReviewsListProps {
  reviews: Review[]
  userMap: Record<string, string>
  currentUserId: string | null
  onReviewDeleted?: (reviewId: string) => void
  layout?: 'square' | 'list'
}

export default function ReviewsList({ 
  reviews, 
  userMap, 
  currentUserId,
  onReviewDeleted,
  layout = 'square'
}: ReviewsListProps) {
  return (
    <div className={`grid gap-6 ${
      layout === 'square' 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full' 
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    }`}>
      {reviews?.map((review) => (
        <div className="h-full" key={review.id}>
          <ReviewCardWrapper
            review={review}
            username={userMap[review.user_id]}
            currentUserId={currentUserId}
            onReviewDeleted={onReviewDeleted}
            layout={layout}
            userMap={userMap}
          />
        </div>
      ))}
    </div>
  )
} 