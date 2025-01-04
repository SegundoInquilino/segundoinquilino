'use client'

import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import ReviewModal from './ReviewModal'
import type { Review } from '@/types/review'

type ReviewCardProps = {
  review: Review
  username: string
  currentUserId?: string | null
  userMap: Record<string, string>
  onClick: () => void
}

export default function ReviewCard({
  review,
  username,
  currentUserId,
  userMap,
  onClick
}: ReviewCardProps) {
  const [isLiking, setIsLiking] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    console.log('ReviewCard - Review completa:', review)
    console.log('ReviewCard - Images:', review.images)
    console.log('ReviewCard - Página:', window.location.pathname)
  }, [review])

  useEffect(() => {
    console.log('ReviewCard - userMap:', userMap)
  }, [userMap])

  if (!review.apartments) {
    return null
  }

  const handleLike = async () => {
    if (!currentUserId || isLiking) return
    setIsLiking(true)

    try {
      await supabase
        .from('review_likes')
        .upsert({ 
          review_id: review.id, 
          user_id: currentUserId 
        })

      onLike?.()
    } catch (error) {
      console.error('Erro ao dar like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId || !comment.trim()) return

    try {
      await supabase
        .from('review_comments')
        .insert({
          review_id: review.id,
          user_id: currentUserId,
          comment: comment.trim()
        })

      setComment('')
      // Recarregar comentários
    } catch (error) {
      console.error('Erro ao comentar:', error)
    }
  }

  const { address, city, state, zip_code, neighborhood } = review.apartments

  const getLikesCount = () => {
    if (typeof review.likes_count === 'number') {
      return review.likes_count
    }
    return review.likes_count?.count || 0
  }

  return (
    <>
      <div 
        onClick={onClick}
        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{address}</h2>
          <div className="space-y-1">
            <p className="text-secondary-600">
              {neighborhood && `${neighborhood}, `}{city}
            </p>
            <p className="text-gray-500 text-sm">
              {state} - {zip_code}
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
            
            <div className="mt-4 flex items-center gap-6 text-sm">
              <button 
                onClick={handleLike}
                disabled={isLiking || !currentUserId}
                className="flex items-center gap-2 text-secondary-600 hover:text-secondary-700 disabled:opacity-50 transition-colors"
              >
                <span className="text-lg">❤️</span>
                <span className="font-medium">{getLikesCount()}</span>
              </button>
              
              <button 
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <span className="text-lg">💬</span>
                <span className="font-medium">Comentários</span>
              </button>

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
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
} 