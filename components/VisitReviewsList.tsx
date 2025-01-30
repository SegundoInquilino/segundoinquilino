'use client'

import { VisitReview } from '@/types/visit-review'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { HomeIcon, BuildingOfficeIcon, TrashIcon, MapPinIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/utils/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useState } from 'react'
import VisitReviewModal from './VisitReviewModal'

interface VisitReviewsListProps {
  reviews: (VisitReview & {
    profiles: {
      username: string
    }
  })[]
}

function NextArrow(props: any) {
  const { onClick } = props
  return (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white/80 hover:bg-white shadow-md"
    >
      <ChevronRightIcon className="h-5 w-5 text-gray-600" />
    </button>
  )
}

function PrevArrow(props: any) {
  const { onClick } = props
  return (
    <button
      onClick={onClick}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white/80 hover:bg-white shadow-md"
    >
      <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
    </button>
  )
}

// Função utilitária para gerar URL do Google Maps
const getGoogleMapsUrl = (address: string) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

export default function VisitReviewsList({ reviews }: VisitReviewsListProps) {
  const { currentUserId } = useAuth()
  const router = useRouter()
  const [selectedReview, setSelectedReview] = useState<(VisitReview & {
    profiles: { username: string }
  }) | null>(null)

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta review?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('visit_reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', currentUserId)

      if (error) throw error

      toast.success('Review deletada com sucesso!')
      router.refresh()
    } catch (error) {
      console.error('Erro ao deletar review:', error)
      toast.error('Erro ao deletar review')
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedReview(review)}
          >
            {/* Cabeçalho com Foto */}
            <div className="relative h-48 bg-gray-100">
              {review.photos && review.photos.length > 0 ? (
                review.photos.length > 1 ? (
                  <Slider
                    dots={true}
                    infinite={true}
                    speed={500}
                    slidesToShow={1}
                    slidesToScroll={1}
                    nextArrow={<NextArrow />}
                    prevArrow={<PrevArrow />}
                    className="h-full"
                  >
                    {review.photos.map((photo, index) => (
                      <div key={index} className="relative h-48">
                        <Image
                          src={photo}
                          alt={`Foto ${index + 1} do imóvel`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority={index === 0}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="relative h-48">
                    <Image
                      src={review.photos[0]}
                      alt="Foto do imóvel"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority
                    />
                  </div>
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  {review.property_type === 'apartment' ? (
                    <Image
                      src="/images/Logo_SI_icon.png"
                      alt="Logo Segundo Inquilino"
                      width={80}
                      height={80}
                      className="opacity-30"
                    />
                  ) : (
                    <Image
                      src="/images/Logo_SI_icon.png"
                      alt="Logo Segundo Inquilino"
                      width={80}
                      height={80}
                      className="opacity-30"
                    />
                  )}
                </div>
              )}

              {/* Badge do tipo de imóvel */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/90 text-gray-800">
                  {review.property_type === 'apartment' ? 'Apartamento' : 'Casa'}
                </span>
              </div>

              {/* Botão de deletar */}
              {currentUserId === review.user_id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(review.id)
                  }}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full text-gray-600 hover:text-red-500 transition-colors"
                  title="Deletar review"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Conteúdo */}
            <div className="p-4">
              {/* Nome do prédio/Endereço */}
              <div className="mb-3">
                {review.building_name && (
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {review.building_name}
                  </h3>
                )}
                <div className="flex items-start space-y-1 text-gray-500 text-sm">
                  <a
                    href={getGoogleMapsUrl(review.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-start hover:text-purple-600 transition-colors"
                  >
                    <MapPinIcon className="h-4 w-4 mt-0.5 mr-1 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium">Endereço:</span>
                      <span className="text-gray-600 hover:text-purple-600">{review.address}</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Origem da visita */}
              <div className="mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {review.source === 'quintoandar' && 'Quinto Andar'}
                  {review.source === 'imovelweb' && 'ImovelWeb'}
                  {review.source === 'vivareal' && 'Viva Real'}
                  {review.source === 'zap' && 'Zap Imóveis'}
                  {review.source === 'other' && 'Outro'}
                  {review.source !== 'quintoandar' && 
                   review.source !== 'imovelweb' && 
                   review.source !== 'vivareal' && 
                   review.source !== 'zap' && 
                   review.source !== 'other' && review.source}
                </span>
              </div>

              {/* Comentário */}
              {review.comment && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {review.comment}
                </p>
              )}

              {/* Pontos positivos e negativos */}
              <div className="space-y-2 mb-4">
                {review.positive_points && review.positive_points.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1.5">
                      Pontos Positivos
                    </h4>
                    <ul className="text-xs text-gray-600 list-disc list-inside">
                      {review.positive_points.slice(0, 2).map((point, index) => (
                        <li key={index} className="line-clamp-1">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {review.negative_points && review.negative_points.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1.5">
                      Pontos Negativos
                    </h4>
                    <ul className="text-xs text-gray-600 list-disc list-inside">
                      {review.negative_points.slice(0, 2).map((point, index) => (
                        <li key={index} className="line-clamp-1">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                <span>{review.profiles.username}</span>
                <span>
                  {formatDistanceToNow(new Date(review.created_at), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedReview && (
        <VisitReviewModal
          review={selectedReview}
          isOpen={!!selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </>
  )
} 