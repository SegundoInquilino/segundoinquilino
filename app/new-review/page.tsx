'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import ImageUpload from '@/components/ImageUpload'
import { useRouter } from 'next/navigation'
import AmenitiesSelector from '@/components/AmenitiesSelector'

// Lista completa de estados brasileiros
const ESTADOS_BRASILEIROS = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
]

interface FormData {
  address: string
  buildingName: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  rating: number
  comment: string
  propertyType: string
  rental_source: string
}

export default function NewReview() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    address: '',
    buildingName: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    rating: 5,
    comment: '',
    propertyType: 'apartment',
    rental_source: ''
  })
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [amenities, setAmenities] = useState<string[]>([])

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
          building_name: formData.propertyType === 'apartment' ? formData.buildingName || null : null,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          property_type: formData.propertyType
        })
        .select()
        .single()

      if (propertyError) {
        console.error('Erro ao criar apartamento:', propertyError)
        throw new Error(`Erro ao criar apartamento: ${propertyError.message}`)
      }

      if (!property) {
        throw new Error('Apartamento não foi criado corretamente')
      }

      // Criar review com amenidades
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          apartment_id: property.id,
          user_id: user.id,
          rating: formData.rating,
          comment: formData.comment,
          images: imageUrls,
          amenities: amenities,
          rental_source: formData.rental_source.trim() || null
        })

      if (reviewError) {
        console.error('Erro ao criar review:', reviewError)
        throw new Error(`Erro ao criar review: ${reviewError.message}`)
      }

      // Emitir evento de atualização
      const event = new CustomEvent('reviewCreated')
      window.dispatchEvent(event)
      
      router.push('/home')
    } catch (error) {
      console.error('Erro detalhado:', error)
      setError(error instanceof Error ? error.message : 'Erro ao criar review')
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
            <label className="block text-sm font-medium text-white bg-black px-2 py-1 rounded inline-block">
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

          {formData.propertyType === 'apartment' && (
            <div>
              <label htmlFor="buildingName" className="block text-sm font-medium text-black">
                Nome do Prédio *
              </label>
              <input
                type="text"
                id="buildingName"
                name="buildingName"
                value={formData.buildingName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Ex: Edifício Aurora, Residencial Flores..."
              />
            </div>
          )}

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-black">
              Endereço *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ex: Rua das Flores, 123"
            />
          </div>

          <div>
            <label htmlFor="neighborhood" className="block text-sm font-medium text-black">
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
            <label className="block text-sm font-medium text-black">Cidade</label>
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
            <label className="block text-sm font-medium text-black">Estado</label>
            <select
              id="state"
              name="state"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              value={formData.state}
              onChange={handleChange}
            >
              <option value="">Selecione o estado</option>
              {ESTADOS_BRASILEIROS.map((estado) => (
                <option key={estado.sigla} value={estado.sigla}>
                  {estado.nome} ({estado.sigla})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black">CEP</label>
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
          <label className="block text-sm font-medium text-black">Avaliação</label>
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
          <label className="block text-sm font-medium text-black">Comentário</label>
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

        <div className="mb-6">
          <label 
            htmlFor="rental_source" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            De onde alugou o imóvel?
          </label>
          <input
            type="text"
            id="rental_source"
            name="rental_source"
            value={formData.rental_source}
            onChange={handleChange}
            placeholder="Ex: QuintoAndar, Imobiliária XYZ, Direto com proprietário..."
            className="w-full p-2 border rounded focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Fotos do Apartamento
          </label>
          <ImageUpload
            onUploadComplete={(urls) => setImageUrls(urls)}
            maxImages={5}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-black mb-2">
            Características do Imóvel
          </label>
          <AmenitiesSelector
            selectedAmenities={amenities}
            onChange={setAmenities}
          />
        </div>

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-yellow-400 text-black py-2 px-4 rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 font-medium transition-colors"
        >
          {submitting ? 'Enviando...' : 'Criar Review'}
        </button>
      </form>
    </div>
  )
} 