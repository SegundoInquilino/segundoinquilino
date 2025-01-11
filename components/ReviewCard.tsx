'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ReviewModal from './ReviewModal'
import type { Review } from '@/types/review'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { address, city, state, zip_code, neighborhood } = review.apartments
  const { currentUserId: authUserId } = useAuth()
  const router = useRouter()

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!authUserId) {
      setShowAuthModal(true)
    } else if (onClick) {
      onClick()
    }
  }

  return (
    <>
      <div 
        onClick={handleCardClick}
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
      </div>

      {showModal && (
        <ReviewModal
          review={review}
          username={username}
          currentUserId={currentUserId}
          userMap={userMap}
        />
      )}

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Faça login para ver mais detalhes
              </h3>
              <p className="text-gray-600 mb-6">
                Para ver a review completa e todas as informações do apartamento, faça login ou crie uma conta.
              </p>

              <div className="space-y-4">
                <Link
                  href="/auth"
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-800 hover:bg-purple-900"
                >
                  Fazer Login
                </Link>
                <Link
                  href="/auth?signup=true"
                  className="w-full inline-flex justify-center items-center px-6 py-3 border border-purple-800 text-base font-medium rounded-md text-purple-800 bg-white hover:bg-purple-50"
                >
                  Criar Conta
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 