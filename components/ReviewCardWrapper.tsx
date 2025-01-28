'use client'

import { useState } from 'react'
import ReviewCard from './ReviewCard'
import type { Review } from '@/types/review'
import { useAuth } from '@/contexts/AuthContext'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { ShareIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

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

  const getShareUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    return `${baseUrl}/reviews?reviewId=${review.id}&showModal=true`
  }

  const shareUrl = getShareUrl()

  const shareOnWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation()
    const text = `Confira esta review do ${review.apartments.building_name} por ${username}: ${getShareUrl()}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  const shareOnTelegram = (e: React.MouseEvent) => {
    e.stopPropagation()
    const text = `Confira esta review do ${review.apartments.building_name} por ${username}: ${getShareUrl()}`
    window.open(`https://t.me/share/url?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(text)}`, '_blank')
  }

  const copyLink = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(getShareUrl())
      toast.success('Link copiado!')
    } catch (err) {
      toast.error('Erro ao copiar link')
    }
  }

  return (
    <>
      <div className="relative">
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

        <div 
          className="absolute bottom-4 left-4 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center px-3 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-sm text-gray-600">
                <ShareIcon className="w-4 h-4 mr-2" />
                Compartilhar
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={shareOnWhatsApp} className="cursor-pointer">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.967.94-1.164.173-.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shareOnTelegram} className="cursor-pointer">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="#0088cc">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.18-2.935 5.36-4.82c.23-.23-.054-.358-.354-.14l-6.62 4.17-2.863-.908c-.62-.176-.63-.62.136-.92l11.325-4.365c.515-.19.97.126.79.913z"/>
                </svg>
                Telegram
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyLink} className="cursor-pointer">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copiar Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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