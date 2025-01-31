'use client'

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { VisitReview } from '@/types/review'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MapPinIcon, LinkIcon } from '@heroicons/react/24/solid'
import Slider from 'react-slick'
import { useState } from 'react'
import ImageViewerModal from './ImageViewerModal'
import { StarIcon } from '@heroicons/react/24/solid'

interface VisitReviewModalProps {
  review: VisitReview & {
    profile?: {
      username?: string
      full_name?: string
      avatar_url?: string
    } | null
  }
  isOpen: boolean
  onClose: () => void
}

// Categorias de avaliação com labels e descrições
const RATING_CATEGORIES = [
  {
    id: 'location',
    label: 'Localização',
    description: 'Facilidade de acesso, transporte público, segurança'
  },
  {
    id: 'condition',
    label: 'Estado do Imóvel',
    description: 'Conservação, instalações'
  },
  {
    id: 'rooms',
    label: 'Quartos',
    description: 'Tamanho, iluminação, ventilação'
  },
  {
    id: 'neighborhood',
    label: 'Vizinhança',
    description: 'Perfil dos vizinhos, barulho'
  },
  {
    id: 'amenities',
    label: 'Comodidades',
    description: 'Proximidade de serviços'
  },
  {
    id: 'renovation',
    label: 'Necessidade de Reformas',
    description: '1 = precisa muito, 5 = não precisa'
  },
  {
    id: 'cost_benefit',
    label: 'Custo-Benefício',
    description: 'Relação preço x benefícios'
  }
] as const

const getGoogleMapsUrl = (address: string) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

const getVisitSourceLabel = (source: string) => {
  const sources = {
    imobiliaria: 'Imobiliária',
    corretor: 'Corretor',
    proprietario: 'Proprietário',
    site: 'Site (QuintoAndar, ImovelWeb, EmCasa, etc)',
    outro: 'Outro'
  }
  return sources[source as keyof typeof sources] || source
}

export default function VisitReviewModal({ review, isOpen, onClose }: VisitReviewModalProps) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Calcular média das avaliações
  const averageRating = Object.values(review.ratings).reduce((a, b) => a + b, 0) / 7

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index)
    setViewerOpen(true)
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev === (review.images?.length || 0) - 1 ? 0 : prev + 1
    )
  }

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (review.images?.length || 0) - 1 : prev - 1
    )
  }

  const handleAddressClick = () => {
    if (review.full_address) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(review.full_address)}`
      )
    }
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white rounded-2xl shadow-xl my-8">
              {/* Header */}
              <div className="sticky top-0 flex justify-between items-start p-6 border-b bg-white rounded-t-2xl">
                <div>
                  <Dialog.Title className="text-xl font-semibold text-gray-900">
                    Detalhes da Visita
                  </Dialog.Title>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center px-3 py-1 bg-yellow-50 rounded-lg">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="ml-1.5 font-semibold text-gray-700">
                        {averageRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Conteúdo */}
              <div className="p-6 space-y-8">
                {/* Galeria de fotos */}
                {review.images && review.images.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Fotos do Imóvel</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {review.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                          onClick={() => setSelectedImage(image)}
                        >
                          <Image
                            src={image}
                            alt={`Foto ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              const imgElement = e.target as HTMLImageElement
                              imgElement.src = '/placeholder-image.jpg'
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Informações do imóvel */}
                <div className="space-y-6">
                  {/* Endereço */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <button
                      onClick={handleAddressClick}
                      className="flex items-start w-full group"
                    >
                      <MapPinIcon className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                      <div className="ml-3">
                        <span className="block font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                          Localização
                        </span>
                        <span className="text-gray-600">{review.full_address}</span>
                      </div>
                    </button>
                  </div>

                  {/* Fonte da visita */}
                  <div className="flex items-center bg-gray-50 rounded-xl p-4">
                    <div className="flex-1">
                      <span className="block font-medium text-gray-900 mb-1">
                        Fonte da Visita
                      </span>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {getVisitSourceLabel(review.visit_source)}
                        </span>
                        {review.listing_url && (
                          <a
                            href={review.listing_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-3 text-purple-600 hover:text-purple-700 flex items-center"
                          >
                            <LinkIcon className="h-5 w-5 mr-1" />
                            <span className="text-sm">Ver anúncio</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Avaliações */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Avaliações Detalhadas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {RATING_CATEGORIES.map(category => (
                        <div
                          key={category.id}
                          className="bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {category.label}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {category.description}
                              </p>
                            </div>
                            <div className="flex items-center bg-white px-2.5 py-1 rounded-lg shadow-sm">
                              <StarIcon className="h-5 w-5 text-yellow-400" />
                              <span className="ml-1.5 font-medium text-gray-700">
                                {review.ratings[category.id]}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Comentários */}
                  {review.comments && (
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h4 className="font-medium text-gray-900 mb-4">
                        Comentários Adicionais
                      </h4>
                      <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                        {review.comments}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {review.profile?.username?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div>
                    <span className="block font-medium text-gray-900">
                      {review.profile?.username || 'Usuário anônimo'}
                    </span>
                    <span className="text-sm text-gray-500">
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

      {/* Modal de imagem ampliada */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          className="relative z-[60]"
        >
          <div className="fixed inset-0 bg-black/95" />
          <div className="fixed inset-0 flex items-center justify-center p-4" onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedImage(null)
            }
          }}>
            <Dialog.Panel className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
              <img
                src={selectedImage}
                alt="Imagem ampliada"
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </>
  )
} 