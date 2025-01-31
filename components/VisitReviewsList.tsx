'use client'

import { useState } from 'react'
import { VisitReview } from '@/types/review'
import VisitReviewCard from './VisitReviewCard'
import VisitReviewsFilter from './VisitReviewsFilter'

interface VisitReviewsListProps {
  initialReviews: (VisitReview & {
    profile?: {
      username?: string
      full_name?: string
      avatar_url?: string
    } | null
  })[]
}

export default function VisitReviewsList({ initialReviews }: VisitReviewsListProps) {
  const [filteredReviews, setFilteredReviews] = useState(initialReviews)

  const handleFilterChange = (filters: {
    search: string
    propertyType: string
    visitSource: string
  }) => {
    const filtered = initialReviews.filter(review => {
      const matchesSearch = filters.search
        ? review.full_address.toLowerCase().includes(filters.search.toLowerCase())
        : true

      const matchesType = filters.propertyType
        ? review.property_type === filters.propertyType
        : true

      const matchesSource = filters.visitSource
        ? review.visit_source === filters.visitSource
        : true

      return matchesSearch && matchesType && matchesSource
    })

    setFilteredReviews(filtered)
  }

  return (
    <>
      <VisitReviewsFilter onFilterChange={handleFilterChange} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredReviews.map((review) => (
          <VisitReviewCard key={review.id} review={review} />
        ))}
      </div>
    </>
  )
} 