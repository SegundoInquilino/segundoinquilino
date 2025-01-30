'use client'

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { VisitReview } from '@/types/visit-review'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MapPinIcon } from '@heroicons/react/24/solid'
import Slider from 'react-slick'
import { useState } from 'react'
import ImageViewerModal from './ImageViewerModal'

interface VisitReviewModalProps {
  review: VisitReview & {
    profiles: {
      username: string
    }
  }
  isOpen: boolean
  onClose: () => void
}

const getGoogleMapsUrl = (address: string) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

export default function VisitReviewModal({ review, isOpen, onClose }: VisitReviewModalProps) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index)
    setViewerOpen(true)
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === (review.photos?.length || 0) - 1 ? 0 : prev + 1
    )
  }

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (review.photos?.length || 0) - 1 : prev - 1
    )
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true
  }

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        {/* Backdrop com blur */}
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

        {/* Full-screen container com scroll */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white rounded-lg shadow-xl my-8">
              {/* Header com botão de fechar */}
              <div className="sticky top-0 flex justify-between items-center p-4 border-b bg-white rounded-t-lg">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Detalhes da Visita
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
                  aria-label="Fechar"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Conteúdo */}
              <div className="p-6">
                {/* Carrossel de fotos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="mb-6 h-96 relative rounded-lg overflow-hidden">
                    <Slider {...sliderSettings}>
                      {review.photos.map((photo, index) => (
                        <div 
                          key={index} 
                          className="relative h-96 cursor-pointer"
                          onClick={() => handleImageClick(index)}
                        >
                          <Image
                            src={photo}
                            alt={`Foto ${index + 1} do imóvel`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                )}

                {/* Informações do imóvel */}
                <div className="space-y-6">
                  {/* Nome do prédio e endereço */}
                  <div>
                    {review.building_name && (
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {review.building_name}
                      </h3>
                    )}
                    <a
                      href={getGoogleMapsUrl(review.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start text-gray-500 hover:text-purple-600 transition-colors"
                    >
                      <MapPinIcon className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span className="font-medium">Endereço:</span>
                        <span className="text-gray-600 hover:text-purple-600">{review.address}</span>
                      </div>
                    </a>
                  </div>

                  {/* Origem da visita */}
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {review.source === 'quintoandar' && 'Quinto Andar'}
                      {review.source === 'imovelweb' && 'ImovelWeb'}
                      {review.source === 'vivareal' && 'Viva Real'}
                      {review.source === 'zap' && 'Zap Imóveis'}
                      {review.source === 'other' && 'Outro'}
                    </span>
                  </div>

                  {/* Comentário */}
                  {review.comment && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Comentário</h4>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  )}

                  {/* Pontos positivos e negativos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {review.positive_points && review.positive_points.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">
                          Pontos Positivos
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {review.positive_points.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {review.negative_points && review.negative_points.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">
                          Pontos Negativos
                        </h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {review.negative_points.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Footer com informações do autor */}
                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
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
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>

      {review.photos && viewerOpen && (
        <ImageViewerModal
          images={review.photos}
          currentIndex={currentImageIndex}
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </>
  )
} 