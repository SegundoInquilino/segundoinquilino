'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import { StarRating } from '@/components/ui/star-rating'

interface ReviewFormProps {
  initialData?: {
    building_name: string
    address: string
    zip_code?: string
    neighborhood?: string
    city?: string
    state?: string
  }
  onSubmit?: (data: any) => Promise<void>
}

const ReviewForm = ({ initialData, onSubmit }: ReviewFormProps) => {
  const router = useRouter()
  const supabase = createClient()
  const { currentUserId } = useAuth()

  const [formData, setFormData] = useState({
    content: '',
    rating: 0,
    building_name: initialData?.building_name || '',
    address: initialData?.address || '',
    zip_code: initialData?.zip_code || '',
    neighborhood: initialData?.neighborhood || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    property_type: 'apartment' as const
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUserId) {
      console.error('Usuário não autenticado')
      return
    }

    try {
      const reviewData = {
        content: formData.content,
        rating: formData.rating,
        apartments: {
          building_name: formData.building_name.trim(),
          address: formData.address.trim(),
          neighborhood: formData.neighborhood.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          property_type: formData.property_type
        }
      }

      console.log('Enviando dados:', reviewData)

      if (onSubmit) {
        await onSubmit(reviewData)
      } else {
        // Comportamento padrão
        const { data, error } = await supabase
          .from('reviews')
          .insert([
            {
              ...reviewData,
              user_id: currentUserId
            }
          ])

        if (error) throw error

        router.push(`/buildings/${encodeURIComponent(formData.building_name.trim())}`)
      }
    } catch (error: any) {
      console.error('Erro ao criar review:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      // Você pode adicionar um estado de erro no formulário se quiser mostrar para o usuário
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold">Nova Review</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nome do Prédio
          </label>
          <input
            type="text"
            value={formData.building_name}
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
            required
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Endereço Completo
          </label>
          <input
            type="text"
            value={formData.address}
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
            required
            readOnly
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bairro
            </label>
            <input
              type="text"
              value={formData.neighborhood}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              required
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cidade
            </label>
            <input
              type="text"
              value={formData.city}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              required
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <input
              type="text"
              value={formData.state}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
              required
              readOnly
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            CEP
          </label>
          <input
            type="text"
            value={formData.zip_code}
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
            required
            readOnly
            placeholder="00000-000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Avaliação
          </label>
          <StarRating
            rating={formData.rating}
            onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
            editable
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sua Experiência
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              content: e.target.value
            }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
        <Button type="submit">
          Publicar Review
        </Button>
      </div>
    </form>
  )
}

export default ReviewForm 