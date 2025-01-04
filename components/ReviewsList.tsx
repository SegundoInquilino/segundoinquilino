'use client'

import ReviewCardWrapper from './ReviewCardWrapper'
import type { Review } from '@/types/review'

type ReviewsListProps = {
  reviews: Review[]
  userMap: Record<string, string>
  currentUserId?: string | null
}

export default function ReviewsList({ reviews, userMap, currentUserId }: ReviewsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews?.map((review) => (
        <ReviewCardWrapper
          key={review.id}
          review={review}
          username={userMap[review.user_id]}
          currentUserId={currentUserId}
          userMap={userMap}
        />
      ))}
    </div>
  )
} 