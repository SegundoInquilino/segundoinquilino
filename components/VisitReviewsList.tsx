'use client'

import { VisitReview } from '@/types/visit-review'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { HomeIcon, BuildingOfficeIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon, PencilIcon } from '@heroicons/react/24/outline'
import { MapPinIcon, ShareIcon } from '@heroicons/react/24/solid'
import { createClient } from '@/utils/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useState } from 'react'
import VisitReviewModal from './VisitReviewModal'
import { Menu, Transition } from '@headlessui/react'
import { LinkIcon } from '@heroicons/react/24/outline'
import EditVisitReviewModal from './EditVisitReviewModal'

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
  const [selectedReviewForEdit, setSelectedReviewForEdit] = useState<(VisitReview & {
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

  const handleShare = async (e: React.MouseEvent, review: VisitReview, type: 'whatsapp' | 'copy' | 'native') => {
    e.stopPropagation()
    
    const shareUrl = `https://segundoinquilino.com.br/visit-reviews/${review.id}`
    const shareText = `Veja o imóvel que ${review.profiles.username} visitou! ${review.building_name ? `\n\nPrédio: ${review.building_name}` : ''}\n\nEndereço: ${review.address}\n\nConfira todos os detalhes da visita no Segundo Inquilino 🏠`

    try {
      switch (type) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`, '_blank')
          break
        
        case 'copy':
          await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
          toast.success('Link copiado para a área de transferência!')
          break
        
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: 'Segundo Inquilino - Review de Visita',
              text: shareText,
              url: shareUrl
            })
          } else {
            await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
            toast.success('Link copiado para a área de transferência!')
          }
          break
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error)
      toast.error('Erro ao compartilhar. Tente novamente.')
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
                <div className="absolute top-4 right-4 z-10 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedReviewForEdit(review)
                    }}
                    className="p-2 bg-white/90 rounded-full text-gray-600 hover:text-purple-500 transition-colors"
                    title="Editar review"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(review.id)
                    }}
                    className="p-2 bg-white/90 rounded-full text-gray-600 hover:text-red-500 transition-colors"
                    title="Deletar review"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
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
                <div className="flex items-start justify-between text-gray-500 text-sm">
                  <a
                    href={getGoogleMapsUrl(review.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-start hover:text-purple-600 transition-colors"
                  >
                    <MapPinIcon className="h-4 w-4 mt-0.5 mr-1 flex-shrink-0 text-purple-600" />
                    <div className="flex flex-col">
                      <span className="font-medium">Endereço:</span>
                      <span className="text-gray-600 hover:text-purple-600">{review.address}</span>
                    </div>
                  </a>
                  <Menu as="div" className="relative">
                    <Menu.Button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-purple-600 transition-colors"
                      title="Compartilhar"
                    >
                      <ShareIcon className="h-4 w-4" />
                    </Menu.Button>

                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 divide-y divide-gray-100">
                        <div className="px-4 py-3">
                          <p className="text-sm text-gray-500 text-left">Compartilhar review</p>
                        </div>
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={(e) => handleShare(e, review, 'whatsapp')}
                                className={`${
                                  active ? 'bg-gray-50' : ''
                                } flex items-start w-full px-4 py-3 text-sm text-gray-700 hover:text-gray-900 group text-left`}
                              >
                                <svg 
                                  viewBox="0 0 24 24" 
                                  className={`h-5 w-5 mr-3 mt-0.5 ${active ? 'text-green-600' : 'text-green-500'}`}
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                <div>
                                  <span className="font-medium">WhatsApp</span>
                                  <p className="text-xs text-gray-500">Compartilhar via WhatsApp</p>
                                </div>
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={(e) => handleShare(e, review, 'copy')}
                                className={`${
                                  active ? 'bg-gray-50' : ''
                                } flex items-start w-full px-4 py-3 text-sm text-gray-700 hover:text-gray-900 group text-left`}
                              >
                                <LinkIcon className={`h-5 w-5 mr-3 mt-0.5 ${active ? 'text-purple-600' : 'text-purple-500'}`} />
                                <div>
                                  <span className="font-medium">Copiar link</span>
                                  <p className="text-xs text-gray-500">Copiar link da review</p>
                                </div>
                              </button>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>

              {/* Origem da visita */}
              <div className="mb-3">
                {review.listing_url ? (
                  <a
                    href={review.listing_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors group"
                  >
                    <span>
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
                    <LinkIcon className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ) : (
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
                )}
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
                    <div className="text-xs text-gray-600 space-y-1">
                      {review.positive_points.slice(0, 2).map((point, index) => (
                        <p key={index} className="line-clamp-1">{point}</p>
                      ))}
                    </div>
                  </div>
                )}
                {review.negative_points && review.negative_points.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1.5">
                      Pontos Negativos
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      {review.negative_points.slice(0, 2).map((point, index) => (
                        <p key={index} className="line-clamp-1">{point}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-white">
                      {review.profiles.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>{review.profiles.username}</span>
                </div>
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

      {selectedReviewForEdit && (
        <EditVisitReviewModal
          review={selectedReviewForEdit}
          isOpen={!!selectedReviewForEdit}
          onClose={() => setSelectedReviewForEdit(null)}
          onUpdate={() => {
            router.refresh()
            setSelectedReviewForEdit(null)
          }}
        />
      )}
    </>
  )
} 