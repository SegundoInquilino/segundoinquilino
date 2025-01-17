'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Modal from './Modal'
import type { Database } from '@/types/supabase'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface RequestReviewModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RequestReviewModal({ isOpen, onClose }: RequestReviewModalProps) {
  const supabase = createClientComponentClient<Database>()
  const [formData, setFormData] = useState({
    building_name: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    zip_code: '',
    email: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7) // 7 dias a partir de hoje

      const { error: supabaseError } = await supabase.from('review_requests').insert({
        building_name: formData.building_name.trim(),
        address: formData.address.trim(),
        neighborhood: formData.neighborhood.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zip_code: formData.zip_code.trim(),
        email: formData.email.trim(),
        notes: formData.notes.trim() || null,
        status: 'pending',
        expires_at: expiresAt.toISOString()
      })

      if (supabaseError) throw supabaseError

      setFormData({
        building_name: '',
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        zip_code: '',
        email: '',
        notes: ''
      })
      
      toast.success('Solicitação enviada com sucesso! 🎉', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '10px',
        },
        icon: '✉️',
      })

      router.push('/review-requests')
    } catch (err) {
      console.error('Erro ao enviar solicitação:', err)
      setError('Erro ao enviar solicitação. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Solicitar Review</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome do Edifício *
            </label>
            <input
              type="text"
              value={formData.building_name}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                building_name: e.target.value
              }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Edifício Aurora"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Endereço *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                address: e.target.value
              }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Rua Example, 123"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Bairro *
              </label>
              <input
                type="text"
                value={formData.neighborhood}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  neighborhood: e.target.value
                }))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Cidade *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  city: e.target.value
                }))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Estado *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  state: e.target.value
                }))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              CEP *
            </label>
            <input
              type="text"
              value={formData.zip_code}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                zip_code: e.target.value
              }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="00000-000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email para contato *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="seu@email.com"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Utilize o email cadastrado no Segundo Inquilino, caso já possua uma conta.
              Este email será usado para acessar a review respondida.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Observações (opcional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                notes: e.target.value
              }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Adicione informações relevantes sobre o imóvel..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  )
} 