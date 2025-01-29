'use client'

import { ReactNode, useState, useEffect } from 'react'
import ReviewsList from './ReviewsList'
import Link from 'next/link'
import { Review } from '@/types/review'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import RegionCard from './RegionCard'
import RegionCarousel from './RegionCarousel'

interface HomeContentProps {
  initialReviews: Review[]
  topReviews: Review[]
  userMap: Record<string, string>
  currentUserId?: string
  regionStats: RegionStats[]
  children?: ReactNode
}

interface RegionStats {
  neighborhood: string
  city: string
  state: string
  count: number
}

export default function HomeContent({ 
  initialReviews, 
  topReviews, 
  userMap, 
  currentUserId,
  regionStats = [],
  children 
}: HomeContentProps) {
  const router = useRouter()
  const { currentUserId: authUserId } = useAuth()
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [topRatedReviews, setTopRatedReviews] = useState(topReviews)

  const handleReviewDeleted = (deletedReviewId: string) => {
    // Atualiza os estados locais imediatamente
    setReviews(prevReviews => 
      prevReviews.filter(review => review.id !== deletedReviewId)
    )
    
    setTopRatedReviews(prevReviews => 
      prevReviews.filter(review => review.id !== deletedReviewId)
    )

    // Atualiza os dados do servidor
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Reviews Recentes</h2>
            <Link
              href="/reviews"
              className="text-purple-800 hover:text-purple-900 font-semibold flex items-center gap-2"
            >
              Ver todas
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <ReviewsList
            reviews={reviews}
            userMap={userMap}
            currentUserId={authUserId}
            onReviewDeleted={handleReviewDeleted}
          />
        </section>

        {regionStats.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Explore por Região
            </h2>
            <RegionCarousel
              regions={regionStats}
              onRegionClick={(neighborhood) => 
                router.push(`/reviews?neighborhood=${encodeURIComponent(neighborhood)}`)
              }
            />
          </section>
        )}

        <section className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Melhores Avaliações</h2>
          <ReviewsList
            reviews={topRatedReviews}
            userMap={userMap}
            currentUserId={authUserId}
            onReviewDeleted={handleReviewDeleted}
          />
        </section>
      </main>
    </div>
  )
} 