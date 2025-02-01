'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'
import ImageUpload from './ImageUpload'
import RatingInput from './RatingInput'
import { StarIcon } from '@heroicons/react/24/solid'
import VisitReviewGuidelines from './VisitReviewGuidelines'

// Definir as categorias de avaliação
const RATING_CATEGORIES = [
  {
    id: 'location',
    label: 'Localização',
    description: 'Avalie a facilidade de acesso, proximidade de transporte público, segurança da região'
  },
  {
    id: 'condition',
    label: 'Estado do Imóvel',
    description: 'Condições gerais de conservação, pintura, instalações elétricas e hidráulicas'
  },
  {
    id: 'rooms',
    label: 'Quartos',
    description: 'Tamanho dos quartos, iluminação natural, ventilação, armários embutidos'
  },
  {
    id: 'neighborhood',
    label: 'Vizinhança',
    description: 'Perfil dos vizinhos, barulho, convivência no prédio/região'
  },
  {
    id: 'amenities',
    label: 'Comodidades',
    description: 'Proximidade de mercados, farmácias, restaurantes, lazer'
  },
  {
    id: 'renovation',
    label: 'Necessidade de Reformas',
    description: 'Avalie se o imóvel precisa de reformas (1 = precisa muito, 5 = não precisa)'
  },
  {
    id: 'cost_benefit',
    label: 'Custo-Benefício',
    description: 'Relação entre o valor pedido e o que o imóvel oferece'
  }
]

const ESTADOS_BRASILEIROS = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
]

// Definir o tipo para visit_source
type VisitSource = 'imobiliaria' | 'corretor' | 'proprietario' | 'site' | 'outro'

// Adicionar tipo para property_type
type PropertyType = 'house' | 'apartment'

interface VisitReviewFormProps {
  userId: string
}

export default function VisitReviewForm({ userId }: VisitReviewFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [images, setImages] = useState<File[]>([])
  const [address, setAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    postal_code: ''
  })
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validações iniciais
      const hasAllRatings = RATING_CATEGORIES.every(category => 
        ratings[category.id] && ratings[category.id] > 0
      )

      if (!hasAllRatings) {
        setError('Por favor, preencha todas as avaliações')
        return
      }

      const form = e.currentTarget
      const formData = new FormData(form)
      const visitSource = formData.get('visit_source') as VisitSource

      if (!visitSource) {
        setError('Por favor, selecione como você visitou o imóvel')
        return
      }

      const supabase = createClient()

      // Primeiro criar a review sem as imagens
      const reviewData = {
        user_id: userId,
        visit_source: visitSource,
        listing_url: formData.get('listing_url') || null,
        ratings,
        comments: formData.get('comments') || null,
        images: [],
        street: address.street,
        number: address.number,
        complement: address.complement || null,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        property_type: propertyType,
        address: `${address.street}, ${address.number}${
          address.complement ? ` ${address.complement}` : ''
        } - ${address.neighborhood}, ${address.city} - ${address.state}, ${address.postal_code}`,
        full_address: `${address.street}, ${address.number}${
          address.complement ? ` ${address.complement}` : ''
        } - ${address.neighborhood}, ${address.city} - ${address.state}, ${address.postal_code}`
      }

      // Inserir a review primeiro
      const { data: review, error: insertError } = await supabase
        .from('visit_reviews')
        .insert(reviewData)
        .select()
        .single()

      if (insertError) {
        throw new Error(insertError.message || 'Erro ao salvar a avaliação')
      }

      // Se houver imagens, fazer o upload em segundo plano
      if (images.length > 0) {
        toast.loading('Fazendo upload das imagens...', { duration: 3000 })
        
        // Upload das imagens em paralelo
        const uploadPromises = images.map(async (image, index) => {
          try {
            const fileExt = image.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${userId}/${fileName}`

            console.log(`[Upload ${index + 1}/${images.length}] Iniciando:`, {
              fileName,
              filePath,
              fileType: image.type,
              userId
            })

            // Verificar se o usuário está autenticado
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
              throw new Error('Usuário não está autenticado')
            }

            // Primeiro fazer o upload
            const { error: uploadError, data: uploadData } = await supabase.storage
              .from('reviews_images')
              .upload(filePath, image, {
                cacheControl: '3600',
                upsert: false,
                contentType: image.type
              })

            if (uploadError) {
              console.error('Upload error:', uploadError.message)
              throw new Error(uploadError.message)
            }

            console.log(`[Upload ${index + 1}/${images.length}] Upload concluído:`, uploadData)

            // Depois pegar a URL pública
            const { data: urlData } = supabase.storage
              .from('reviews_images')
              .getPublicUrl(filePath)

            if (!urlData) {
              console.error(`[Upload ${index + 1}/${images.length}] Erro ao gerar URL`)
              return null
            }

            console.log(`[Upload ${index + 1}/${images.length}] URL gerada:`, urlData)
            return urlData.publicUrl

          } catch (error) {
            console.error(`[Upload ${index + 1}/${images.length}] Erro inesperado:`, {
              error,
              message: error instanceof Error ? error.message : 'Erro desconhecido',
              stack: error instanceof Error ? error.stack : undefined
            })
            return null
          }
        })

        // Aguardar todos os uploads
        const imageUrls = (await Promise.all(uploadPromises)).filter(Boolean)
        console.log('URLs finais:', imageUrls)

        if (imageUrls.length > 0) {
          // Atualizar a review com as URLs
          const { error: updateError } = await supabase
            .from('visit_reviews')
            .update({ images: imageUrls })
            .eq('id', review.id)

          if (updateError) {
            console.error('Erro ao atualizar imagens:', {
              error: updateError,
              code: updateError.code,
              message: updateError.message,
              details: updateError.details
            })
            toast.error('Algumas imagens não puderam ser salvas')
          } else {
            console.log('Review atualizada com sucesso com as imagens:', imageUrls)
          }
        } else {
          console.warn('Nenhuma imagem foi carregada com sucesso')
          toast.error('Não foi possível fazer o upload das imagens')
        }
      }

      toast.success('Avaliação enviada com sucesso!')
      router.push('/visit-reviews')

    } catch (error) {
      console.error('Erro ao enviar review:', error)
      setError(error instanceof Error ? error.message : 'Erro ao enviar avaliação. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <VisitReviewGuidelines />
      
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Origem da visita e link do anúncio */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Como você visitou o imóvel?
          </label>
          <select
            name="visit_source"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="">Selecione...</option>
            <option value="imobiliaria">Imobiliária</option>
            <option value="corretor">Corretor</option>
            <option value="proprietario">Proprietário</option>
            <option value="site">Site (QuintoAndar, ImovelWeb, EmCasa, etc)</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Link do anúncio (opcional)
          </label>
          <input
            type="url"
            name="listing_url"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Avaliações por categoria */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Avaliações</h3>
        
        <div className="grid gap-6 md:grid-cols-2">
          {RATING_CATEGORIES.map(category => (
            <div key={category.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <label className="block text-sm font-medium text-gray-700">
                {category.label}
              </label>
              <p className="mt-1 text-sm text-gray-500">
                {category.description}
              </p>
              <div className="mt-3">
                <RatingInput
                  value={ratings[category.id] || 0}
                  onChange={(value) => setRatings(prev => ({
                    ...prev,
                    [category.id]: value
                  }))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comentários adicionais */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Outros comentários
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Compartilhe outras observações relevantes sobre sua visita ao imóvel
        </p>
        <textarea
          name="comments"
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        />
      </div>

      {/* Upload de fotos */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Fotos do imóvel (opcional)
        </label>
        <p className="mt-1 text-sm text-gray-500">
          Adicione fotos que você tirou durante a visita
        </p>
        <ImageUpload
          images={images}
          onChange={setImages}
          maxFiles={5}
        />
      </div>

      {/* Endereço */}
      <div className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Nome da Rua *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={address.street}
            onChange={(e) => {
              // Remove números e caracteres especiais, mantém apenas letras, espaços e pontuação básica
              const value = e.target.value.replace(/[0-9]/g, '')
              setAddress(prev => ({ ...prev, street: value }))
            }}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Ex: Rua das Flores"
            pattern="^[A-Za-zÀ-ÖØ-öø-ÿ\s\.,'-]+$"
            title="Digite apenas o nome da rua, sem números"
          />
          <p className="mt-1 text-sm text-gray-500">
            Digite apenas o nome da rua, sem o número
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
              Bairro *
            </label>
            <input
              type="text"
              id="neighborhood"
              name="neighborhood"
              value={address.neighborhood}
              onChange={(e) => setAddress(prev => ({ ...prev, neighborhood: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Ex: Centro"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Cidade *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Ex: São Paulo"
            />
          </div>
        </div>
      </div>

      {/* Adicionar seleção de tipo de imóvel */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tipo de Imóvel
        </label>
        <div className="mt-2">
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="property_type"
                value="apartment"
                checked={propertyType === 'apartment'}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="form-radio h-4 w-4 text-purple-600"
              />
              <span className="ml-2">Apartamento</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="property_type"
                value="house"
                checked={propertyType === 'house'}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="form-radio h-4 w-4 text-purple-600"
              />
              <span className="ml-2">Casa</span>
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Enviar avaliação'}
      </button>
    </form>
  )
} 