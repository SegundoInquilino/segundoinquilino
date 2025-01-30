'use client'

import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { VisitReview } from '@/types/visit-review'
import { useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import toast from 'react-hot-toast'
import ImageUpload from './ImageUpload'

interface EditVisitReviewModalProps {
  review: VisitReview
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export default function EditVisitReviewModal({ review, isOpen, onClose, onUpdate }: EditVisitReviewModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [propertyType, setPropertyType] = useState(review.property_type)
  const [buildingName, setBuildingName] = useState(review.building_name || '')
  const [address, setAddress] = useState(review.address)
  const [comment, setComment] = useState(review.comment || '')
  const [positivePoints, setPositivePoints] = useState(review.positive_points?.join('\n') || '')
  const [negativePoints, setNegativePoints] = useState(review.negative_points?.join('\n') || '')
  const [source, setSource] = useState(review.source)
  const [otherSource, setOtherSource] = useState('')
  const [listingUrl, setListingUrl] = useState(review.listing_url || '')
  const [photos, setPhotos] = useState<string[]>(review.photos || [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const finalSource = source === 'other' ? otherSource.trim() : source

      const updatedReview = {
        property_type: propertyType,
        building_name: propertyType === 'apartment' ? buildingName : null,
        address,
        comment,
        positive_points: positivePoints.split('\n').filter(Boolean),
        negative_points: negativePoints.split('\n').filter(Boolean),
        source: finalSource,
        listing_url: listingUrl,
        photos
      }

      const supabase = createClient()
      const { error } = await supabase
        .from('visit_reviews')
        .update(updatedReview)
        .eq('id', review.id)

      if (error) throw error

      toast.success('Review atualizada com sucesso!')
      onUpdate()
      onClose()
    } catch (error) {
      console.error('Erro ao atualizar review:', error)
      toast.error('Erro ao atualizar review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <Dialog.Title className="text-lg font-semibold">
                Editar Review de Visita
              </Dialog.Title>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Tipo de Imóvel */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de Imóvel
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as 'apartment' | 'house')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="apartment">Apartamento</option>
                  <option value="house">Casa</option>
                </select>
              </div>

              {/* Nome do Prédio (se for apartamento) */}
              {propertyType === 'apartment' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome do Prédio
                  </label>
                  <input
                    type="text"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              )}

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Endereço
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Comentário */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Comentário
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Pontos Positivos */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pontos Positivos (um por linha)
                </label>
                <textarea
                  value={positivePoints}
                  onChange={(e) => setPositivePoints(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Pontos Negativos */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pontos Negativos (um por linha)
                </label>
                <textarea
                  value={negativePoints}
                  onChange={(e) => setNegativePoints(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Origem e Link */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Origem da Visita
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="quintoandar">Quinto Andar</option>
                    <option value="imovelweb">ImovelWeb</option>
                    <option value="vivareal">Viva Real</option>
                    <option value="zap">Zap Imóveis</option>
                    <option value="other">Outro</option>
                  </select>
                </div>

                {source === 'other' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Especifique a origem
                    </label>
                    <input
                      type="text"
                      value={otherSource}
                      onChange={(e) => setOtherSource(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Link do anúncio (opcional)
                  </label>
                  <input
                    type="url"
                    value={listingUrl}
                    onChange={(e) => setListingUrl(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Upload de Fotos */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fotos
                </label>
                <ImageUpload
                  onImagesUploaded={setPhotos}
                  maxImages={5}
                  existingImages={photos}
                />
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
} 