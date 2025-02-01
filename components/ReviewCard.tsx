'use client'

import { useState } from 'react'
import { formatDistanceToNow, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import ReviewModal from './ReviewModal'
import type { Review } from '@/types/review'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { StarRating } from '@/components/ui/star-rating'
import AuthModal from './AuthModal'
import { AMENITIES } from '@/types/amenities'
import { 
  getReviewTitle, 
  getReviewLocation, 
  getReviewAddress,
  getReviewAuthor,
  getReviewSummary 
} from '@/utils/review'
import { TrashIcon, HomeIcon, BuildingOfficeIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/utils/supabase-client'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import ImageCarousel from './ImageCarousel'

// Funções auxiliares
const getInitials = (name?: string) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (date: string) => {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: ptBR
  })
}

interface ReviewCardProps {
  review: Review
  username: string
  currentUserId: string | null
  onDelete?: (reviewId: string) => void
  layout?: 'square' | 'list' | 'profile'
  userMap: Record<string, string>
  isModal: boolean
  onOpenModal?: () => void
}

export default function ReviewCard({
  review,
  username,
  currentUserId,
  onDelete,
  layout,
  userMap,
  isModal = false,
  onOpenModal
}: ReviewCardProps) {
  const [showModal, setShowModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { currentUserId: authUserId } = useAuth()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!authUserId) {
      setShowAuthModal(true)
    } else if (onOpenModal) {
      onOpenModal()
    }
  }

  const handleDeleteReview = async () => {
    setIsDeleting(true)
    const supabase = createClient()

    try {
      await supabase
        .from('comments')
        .delete()
        .eq('review_id', review.id)

      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', review.id)

      if (error) throw error

      onDelete?.(review.id)
      setShowModal(false)
      router.refresh()
    } catch (error) {
      console.error('Erro ao deletar review:', error)
      alert('Erro ao deletar review. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatPeriod = () => {
    if (!review.lived_from) return null

    const fromDate = format(new Date(review.lived_from), 'MMM yyyy', { locale: ptBR })
    
    if (review.currently_living) {
      return `Mora desde ${fromDate}`
    }

    if (review.lived_until) {
      const untilDate = format(new Date(review.lived_until), 'MMM yyyy', { locale: ptBR })
      return `Morou de ${fromDate} até ${untilDate}`
    }

    return `Morou desde ${fromDate}`
  }

  return (
    <>
      <div className={`
        w-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200
        ${isModal ? 'p-6' : 'p-5'}
        ${layout === 'profile' ? 'max-w-2xl mx-auto' : ''}
      `}>
        {!isModal ? (
          <>
            {/* Carrossel de imagens */}
            {review.images && review.images.length > 0 && (
              <div className={`
                -mx-5 -mt-5 mb-6
                ${layout === 'profile' ? 'aspect-video' : ''}
              `}>
                <ImageCarousel 
                  images={review.images} 
                  alt={`Review de ${review.apartments?.building_name || 'apartamento'}`}
                />
              </div>
            )}

            {/* Cabeçalho com informações do autor */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-5">
              {/* Informações do autor */}
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage src={review.profiles?.avatar_url || ''} />
                  <AvatarFallback className="bg-black text-white font-bold">
                    {getInitials(getReviewAuthor(review, userMap))}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {getReviewAuthor(review, userMap)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(review.created_at)}
                  </p>
                </div>
              </div>

              {/* Rating e botão deletar */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <div className="bg-gray-50 px-3 py-1 rounded-full">
                  <StarRating rating={review.rating} size="sm" />
                </div>
                {currentUserId === review.user_id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDeleteDialog(true)
                    }}
                    disabled={isDeleting}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 flex-shrink-0"
                    title="Deletar review"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Informações do imóvel */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg">
                  {(review.apartments.property_type || 'apartment') === 'house' ? (
                    <HomeIcon className="w-5 h-5 text-gray-700" />
                  ) : (
                    <BuildingOfficeIcon className="w-5 h-5 text-gray-700" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {review.apartments.building_name}
                </h3>
              </div>

              {formatPeriod() && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="p-1.5 bg-gray-50 rounded-lg">
                    <CalendarIcon className="w-4 h-4" />
                  </div>
                  <span>{formatPeriod()}</span>
                </div>
              )}
            </div>

            {/* Endereço e fonte do aluguel */}
            <div className="space-y-3 mb-6">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${review.apartments.address}, ${review.apartments.neighborhood}, ${review.apartments.city} - ${review.apartments.state}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="p-2 bg-blue-600 group-hover:bg-blue-700 rounded-lg transition-colors">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-900 font-medium line-clamp-1">{getReviewAddress(review)}</p>
                  <p className="text-sm text-gray-500">{getReviewLocation(review)}</p>
                </div>
              </a>

              {review.rental_source && (
                <div className="flex items-center gap-2 text-sm text-gray-600 pl-2 border-l-2 border-gray-100">
                  <span className="font-medium">Alugado via:</span>
                  <span className="text-gray-500">{review.rental_source}</span>
                </div>
              )}
            </div>

            {/* Resumo da review */}
            <div className="mb-6">
              <p className={`
                text-sm text-gray-600
                ${layout === 'profile' ? 'line-clamp-4' : 'line-clamp-3'}
              `}>
                {getReviewSummary(review)}
              </p>
            </div>

            {/* Amenidades */}
            {review.amenities && review.amenities.length > 0 && (
              <div className={`
                mb-6
                ${layout === 'profile' ? 'flex-wrap' : ''}
              `}>
                <div className="flex flex-wrap gap-2">
                  {review.amenities.slice(0, 3).map((amenityId: string) => {
                    const amenity = AMENITIES.find(a => a.id === amenityId)
                    if (!amenity) return null
                    
                    return (
                      <span 
                        key={amenityId}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <span className="mr-1.5">{amenity.icon}</span>
                        {amenity.label}
                      </span>
                    )
                  })}
                  {review.amenities.length > 3 && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
                      +{review.amenities.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Botão Ver mais */}
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCardClick}
                className="hover:bg-gray-50"
              >
                Ver mais
              </Button>
            </div>
          </>
        ) : (
          <ReviewModal
            review={{
              ...review,
              profiles: {
                ...review.profiles,
                avatar_fallback_class: "bg-black text-white font-bold"
              }
            }}
            username={username || review.profiles?.full_name || userMap[review.user_id] || 'Usuário'}
            currentUserId={currentUserId}
            userMap={userMap}
          />
        )}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              Deletar Review
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Tem certeza que deseja deletar esta review? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isDeleting}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              onClick={handleDeleteReview}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deletando...' : 'Deletar Review'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 