'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ReviewModal from './ReviewModal'
import type { Review } from '@/types/review'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface ReviewCardProps {
  review: Review
  username: string
  currentUserId?: string | null
  userMap: Record<string, string>
  onClick?: () => void
  layout?: 'grid' | 'square'
}

export default function ReviewCard({
  review,
  username,
  currentUserId,
  userMap,
  onClick,
  layout
}: ReviewCardProps) {
  const [showModal, setShowModal] = useState(false)
  const { address, city, state, zip_code, neighborhood } = review.apartments
  const { currentUserId: authUserId } = useAuth()

  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer ${layout === 'square' ? 'h-full' : ''}`}
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="p-6">
          <div className="mb-4">
            {review.apartments.building_name && (
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {review.apartments.building_name}
              </h3>
            )}
            <p className="text-gray-600">
              <span className="font-semibold">{address}</span>
              {neighborhood && <span>, {neighborhood}</span>}
            </p>
            <p className="text-gray-600">
              {city} - {state}
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-primary-600">
                Por: {username}
              </span>
              <div className="flex items-center">
                <span className="text-yellow-400 text-lg">
                  {'★'.repeat(review.rating)}
                </span>
                <span className="text-gray-300 text-lg">
                  {'★'.repeat(5 - review.rating)}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-2">
              {review.comment}
            </p>
            <p className="text-primary-600 text-sm hover:text-primary-700">
              Clique para ver mais...
            </p>
            
            <div className="mt-4 flex items-center">
              <span className="text-xs text-gray-400 ml-auto">
                {formatDistanceToNow(new Date(review.created_at), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ReviewModal
          review={review}
          username={username}
          currentUserId={currentUserId}
          userMap={userMap}
        />
      )}

      {!authUserId && (
        <div className="mt-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-purple-800 font-medium text-center sm:text-left">
              Faça login para ver mais detalhes e avaliações completas
            </p>
            <Link
              href="/auth"
              onClick={(e) => e.stopPropagation()}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span className="flex items-center">
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Fazer Login
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
} 