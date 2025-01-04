'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function ReviewForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    rating: 5,
    comment: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Obter o usuário atual
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      setError('Você precisa estar logado para criar uma review')
      setLoading(false)
      return
    }

    // Primeiro, inserir o apartamento
    const { data: apartment, error: apartmentError } = await supabase
      .from('apartments')
      .insert([{
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode
      }])
      .select()
      .single()

    if (apartmentError) {
      setError(apartmentError.message)
      setLoading(false)
      return
    }

    // Depois, inserir a review com o user_id
    const { error: reviewError } = await supabase
      .from('reviews')
      .insert([{
        apartment_id: apartment.id,
        user_id: session.user.id,
        rating: formData.rating,
        comment: formData.comment
      }])

    if (reviewError) {
      setError(reviewError.message)
    } else {
      router.push('/')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Endereço
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Cidade
          </label>
          <input
            type="text"
            id="city"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            Estado
          </label>
          <input
            type="text"
            id="state"
            value={formData.state}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
            CEP
          </label>
          <input
            type="text"
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
          Avaliação
        </label>
        <select
          id="rating"
          value={formData.rating}
          onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num} estrelas</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
          Comentário
        </label>
        <textarea
          id="comment"
          rows={4}
          value={formData.comment}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Enviar Review'}
      </button>
    </form>
  )
} 