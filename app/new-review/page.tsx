'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import ImageUpload from '@/components/ImageUpload'
import { useRouter } from 'next/navigation'

export default function NewReview() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    rating: 5,
    comment: '',
    propertyType: 'apartment'
  })
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      // Criar apartamento
      const { data: property, error: propertyError } = await supabase
        .from('apartments')
        .insert({
          address: formData.address,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          property_type: formData.propertyType
        })
        .select()
        .single()

      if (propertyError) throw propertyError

      // Criar review com imagens
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          apartment_id: property.id,
          user_id: user.id,
          rating: formData.rating,
          comment: formData.comment,
          images: imageUrls // Array de URLs das imagens
        })

      if (reviewError) {
        console.error('Erro ao criar review:', reviewError)
        throw reviewError
      }

      router.push('/reviews')
    } catch (error) {
      console.error('Erro:', error)
      setError('Erro ao criar review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Nova Review</h1>

      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          📝 Boas Práticas para sua Review
        </h2>
        <div className="space-y-3 text-gray-600">
          <p className="font-medium text-primary-600 mb-2">
            Compartilhe informações relevantes que ajudarão outros inquilinos a tomar uma decisão informada:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-2">
            <li>Como foi/é sua experiência morando no apartamento?</li>
            <li>O prédio possui acessibilidade? (elevadores, rampas, etc)</li>
            <li>Como é a segurança do local e da região?</li>
            <li>Existem estabelecimentos próximos? (mercados, farmácias, etc)</li>
            <li>Como é o transporte público da região? (metrô, ônibus, etc)</li>
            <li>Como é a qualidade da infraestrutura? (água, luz, internet)</li>
            <li>Existe barulho excessivo? (vizinhos, rua, obras)</li>
            <li>Como é a administração do condomínio?</li>
            <li>Há áreas de lazer? Como é a manutenção?</li>
          </ul>
          <div className="mt-4 text-sm bg-white p-4 rounded-lg border border-primary-100">
            <p className="font-medium text-primary-600">💡 Dicas importantes:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-gray-600">
              <li>Seja honesto e imparcial em sua avaliação</li>
              <li>Inclua tanto pontos positivos quanto negativos</li>
              <li>Adicione fotos para ilustrar melhor sua experiência</li>
              <li>Evite informações pessoais ou que identifiquem outras pessoas</li>
              <li>Mantenha um tom construtivo e respeitoso</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Imóvel
            </label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="apartment">Apartamento</option>
              <option value="house">Casa</option>
            </select>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Endereço
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
              Bairro
            </label>
            <input
              type="text"
              id="neighborhood"
              name="neighborhood"
              value={formData.neighborhood || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cidade</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecione...</option>
              <option value="SP">São Paulo</option>
              <option value="RJ">Rio de Janeiro</option>
              {/* Adicione outros estados conforme necessário */}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CEP</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Avaliação</label>
          <div className="mt-1 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                className={`text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Comentário</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Compartilhe sua experiência com este apartamento..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fotos do Apartamento
          </label>
          <ImageUpload
            onUploadComplete={(urls) => setImageUrls(urls)}
            maxImages={5}
          />
        </div>

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {submitting ? 'Enviando...' : 'Criar Review'}
        </button>
      </form>
    </div>
  )
} 