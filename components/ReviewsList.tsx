'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import ReviewCardWrapper from './ReviewCardWrapper'
import type { Review } from '@/types/review'

interface ReviewsListProps {
  reviews: Review[]
  userMap: Record<string, string>
  currentUserId?: string | null
  onReviewDeleted?: (reviewId: string) => void
  layout?: 'grid' | 'square'
}

export default function ReviewsList({ 
  reviews, 
  userMap, 
  currentUserId,
  onReviewDeleted,
  layout = 'grid'
}: ReviewsListProps) {
  const [viewMode, setViewMode] = useState('grid')
  
  useEffect(() => {
    loadUserSettings()
  }, [])

  const loadUserSettings = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: settings } = await supabase
        .from('user_settings')
        .select('default_view')
        .eq('user_id', user.id)
        .single()
      
      if (settings?.default_view) {
        setViewMode(settings.default_view)
      }
    }
  }

  return (
    <div className={`grid gap-6 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1'
    }`}>
      {reviews?.map((review) => (
        <ReviewCardWrapper
          key={review.id}
          review={review}
          username={userMap[review.user_id]}
          currentUserId={currentUserId}
          onReviewDeleted={() => onReviewDeleted?.(review.id)}
          layout={layout}
          userMap={userMap}
        />
      ))}
    </div>
  )
} 