'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import { StarRating } from '@/components/ui/star-rating'

const ReviewForm = () => {
  const router = useRouter()
  const supabase = createClient()
  const { currentUserId } = useAuth()

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 0,
    building_name: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    property_type: 'apartment' as const
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUserId) {
      console.error('Usuário não autenticado')
      return
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            title: formData.title,
            content: formData.content,
            rating: formData.rating,
            user_id: currentUserId,
            apartments: {
              building_name: formData.building_name.trim(),
              address: formData.address.trim(),
              neighborhood: formData.neighborhood.trim(),
              city: formData.city.trim(),
              state: formData.state.trim(),
              property_type: formData.property_type
            }
          }
        ])

      if (error) throw error

      router.push(`/buildings/${encodeURIComponent(formData.building_name.trim())}`)
    } catch (error) {
      console.error('Erro ao criar review:', error)
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
            onChange={(e) => setFormData(prev => ({
              ...prev,
              building_name: e.target.value
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Endereço Completo
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              address: e.target.value
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
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
              onChange={(e) => setFormData(prev => ({
                ...prev,
                neighborhood: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cidade
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                city: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                state: e.target.value
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>
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
            Título da Review
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              title: e.target.value
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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