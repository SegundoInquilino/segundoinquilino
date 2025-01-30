'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import ImageUpload from './ImageUpload'

export default function VisitReviewForm() {
  const router = useRouter()
  const { currentUserId } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photos, setPhotos] = useState<string[]>([])
  const [propertyType, setPropertyType] = useState<'apartment' | 'house'>('apartment')
  const [source, setSource] = useState<string>('quintoandar')
  const [otherSource, setOtherSource] = useState<string>('')
  const [listingUrl, setListingUrl] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!currentUserId) {
      toast.error('Você precisa estar logado para criar uma review')
      return
    }

    setIsSubmitting(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      if (source === 'other' && !otherSource.trim()) {
        throw new Error('Por favor, especifique a origem da visita')
      }

      const finalSource = source === 'other' ? otherSource.trim() : source

      const visitReview = {
        user_id: currentUserId,
        property_type: formData.get('property_type'),
        building_name: propertyType === 'apartment' ? formData.get('building_name') : null,
        address: formData.get('address'),
        comment: formData.get('comment'),
        positive_points: formData.get('positive_points')?.toString().split('\n').filter(Boolean),
        negative_points: formData.get('negative_points')?.toString().split('\n').filter(Boolean),
        source: finalSource,
        photos,
        status: 'published',
        listing_url: listingUrl
      }

      console.log('Dados a serem enviados:', visitReview)

      const supabase = createClient()
      const { error, data } = await supabase
        .from('visit_reviews')
        .insert(visitReview)
        .select()
        .single()

      if (error) {
        console.error('Erro do Supabase:', error)
        throw new Error(error.message)
      }

      console.log('Review criada com sucesso:', data)
      toast.success('Review de visita criada com sucesso!')
      router.push('/visit-reviews')
      router.refresh()
    } catch (error) {
      console.error('Erro detalhado:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Erro ao criar review. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSource(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de Imóvel
        </label>
        <select
          name="property_type"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          onChange={(e) => setPropertyType(e.target.value as 'apartment' | 'house')}
          value={propertyType}
        >
          <option value="apartment">Apartamento</option>
          <option value="house">Casa</option>
        </select>
      </div>

      {propertyType === 'apartment' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome do Prédio
          </label>
          <input
            type="text"
            name="building_name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Ex: Edifício Solar das Flores"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Endereço Completo
        </label>
        <input
          type="text"
          name="address"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          placeholder="Ex: Rua das Flores, 123 - Bairro - Cidade/UF"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Comentário
        </label>
        <textarea
          name="comment"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Pontos Positivos (um por linha)
        </label>
        <textarea
          name="positive_points"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Pontos Negativos (um por linha)
        </label>
        <textarea
          name="negative_points"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Origem da Visita
        </label>
        <select
          id="source"
          name="source"
          value={source}
          onChange={handleSourceChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
        >
          <option value="">Selecione a origem</option>
          <option value="quintoandar">Quinto Andar</option>
          <option value="imovelweb">ImovelWeb</option>
          <option value="vivareal">Viva Real</option>
          <option value="zap">Zap Imóveis</option>
          <option value="other">Outro</option>
        </select>

        {source === 'other' && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Especifique a origem
            </label>
            <input
              type="text"
              value={otherSource}
              onChange={(e) => setOtherSource(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Ex: Imobiliária Local, Indicação, etc."
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="listing_url" className="block text-sm font-medium text-gray-700">
          Link do anúncio (opcional)
        </label>
        <div className="mt-1">
          <input
            type="url"
            name="listing_url"
            id="listing_url"
            value={listingUrl}
            onChange={(e) => setListingUrl(e.target.value)}
            placeholder="https://www.quintoandar.com.br/imovel/..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Adicione o link do anúncio original para referência futura
        </p>
      </div>

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

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Enviando...' : 'Criar Review de Visita'}
      </button>
    </form>
  )
} 