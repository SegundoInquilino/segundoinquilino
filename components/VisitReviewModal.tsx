'use client'

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { VisitReview } from '@/types/review'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MapPinIcon, LinkIcon, TrashIcon } from '@heroicons/react/24/solid'
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
  isOwner?: boolean
  onDelete?: () => void
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

export default function VisitReviewModal({ 
  review, 
  isOpen, 
  onClose,
  isOwner,
  onDelete 
}: VisitReviewModalProps) {
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
            <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white rounded-2xl shadow-xl my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
              {/* Header mais compacto em mobile */}
              <div className="sticky top-0 z-20 flex justify-between items-start p-4 sm:p-6 border-b bg-white rounded-t-2xl">
                <div>
                  <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900">
                    Detalhes da Visita
                  </Dialog.Title>
                  <div className="flex flex-col sm:flex-row sm:items-center mt-2 sm:space-x-4 space-y-2 sm:space-y-0">
                    <div className="flex items-center px-3 py-1 bg-yellow-50 rounded-lg w-fit">
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

              {/* Conteúdo com padding ajustado */}
              <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto">
                {/* Endereço - Agora no topo e com design melhorado */}
                <div className="bg-gradient-to-r from-purple-50 to-gray-50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <MapPinIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Localização
                      </h3>
                      <button
                        onClick={handleAddressClick}
                        className="w-full text-left group"
                      >
                        <p className="text-gray-600 group-hover:text-purple-700 transition-colors">
                          {review.full_address}
                        </p>
                        <div className="mt-2 inline-flex items-center text-sm text-purple-600 group-hover:text-purple-700">
                          <span>Ver no Google Maps</span>
                          <svg 
                            className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M14 5l7 7m0 0l-7 7m7-7H3" 
                            />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Galeria de fotos */}
                {review.images && review.images.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Fotos do Imóvel</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
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
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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

                {/* Fonte da visita */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex-1">
                    <span className="block font-medium text-gray-900 mb-2">
                      Fonte da Visita
                    </span>
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {getVisitSourceLabel(review.visit_source)}
                      </span>
                      {review.listing_url && (
                        <a
                          href={review.listing_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 text-sm text-purple-600 hover:text-purple-700"
                        >
                          <LinkIcon className="h-5 w-5 mr-1" />
                          <span>Ver anúncio</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Grid de avaliações ajustado */}
                <div className="grid grid-cols-1 gap-4">
                  {RATING_CATEGORIES.map(category => (
                    <div
                      key={category.id}
                      className="bg-gray-50 p-3 sm:p-4 rounded-xl hover:bg-gray-100 transition-colors"
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

              {/* Footer */}
              <div className="sticky bottom-0 z-20 flex items-center justify-between p-4 sm:p-6 border-t bg-gray-50 rounded-b-2xl">
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
                {isOwner && onDelete && (
                  <button
                    onClick={onDelete}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-5 w-5 mr-1" />
                    Excluir avaliação
                  </button>
                )}
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
            <Dialog.Panel 
              className="relative w-full max-w-5xl" 
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>
              <div className="relative w-full h-[80vh] max-h-[80vh]">
                <Image
                  src={selectedImage}
                  alt="Imagem ampliada"
                  fill
                  className="object-contain rounded-lg"
                  sizes="100vw"
                />
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </>
  )
} 