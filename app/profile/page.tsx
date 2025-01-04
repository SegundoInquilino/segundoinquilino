'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ReviewModal from '@/components/ReviewModal'

// Definir interfaces
interface Apartment {
  id: string
  address: string
  city: string
  state: string
  zip_code: string
}

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  images?: string[]
  apartments: Apartment
  user_id: string
  likes_count?: { count: number } | number
}

interface Profile {
  id: string
  username: string
}

interface UserMap {
  [key: string]: string
}

export default function ProfilePage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsCount, setReviewsCount] = useState(0)
  const [commentsCount, setCommentsCount] = useState(0)
  const [likesCount, setLikesCount] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [userMap, setUserMap] = useState<Record<string, string>>({})
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      // Definir currentUserId
      setCurrentUserId(user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, email')
        .eq('id', user.id)
        .single()

      if (profile) {
        setUsername(profile.username || '')
        setEmail(profile.email || '')
      }

      // Carregar reviews com tipagem correta
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          images,
          user_id,
          apartments (
            id,
            address,
            city,
            state,
            zip_code
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      // Criar userMap
      const newUserMap: Record<string, string> = {}
      newUserMap[user.id] = profile?.username || 'Usuário'
      setUserMap(newUserMap)

      setReviews(reviewsData as Review[] || [])
      setReviewsCount(reviewsData?.length || 0)

      const { count: comments } = await supabase
        .from('review_comments')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)

      setCommentsCount(comments || 0)

      const { count: likes } = await supabase
        .from('review_likes')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)

      setLikesCount(likes || 0)

    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      setMessage({
        type: 'success',
        text: 'Perfil atualizado com sucesso!'
      })
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      setMessage({
        type: 'error',
        text: 'Erro ao atualizar perfil. Tente novamente.'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleShowDetails = (review: Review) => {
    setSelectedReview(review)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center">
            Carregando perfil...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {username ? username[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Seu Perfil</h1>
              <p className="text-gray-600">Gerencie suas informações pessoais</p>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nome de usuário
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                aria-label="Email (não pode ser alterado)"
              />
              <p className="mt-1 text-sm text-gray-500">
                O email não pode ser alterado por questões de segurança
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push('/reviews')}
                className="px-6 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </form>
        </div>

        {/* Seção de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reviews</h3>
            <p className="text-3xl font-bold text-primary-600">{reviewsCount}</p>
            <p className="text-sm text-gray-600">Reviews publicadas</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Comentários</h3>
            <p className="text-3xl font-bold text-primary-600">{commentsCount}</p>
            <p className="text-sm text-gray-600">Comentários feitos</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Curtidas</h3>
            <p className="text-3xl font-bold text-primary-600">{likesCount}</p>
            <p className="text-sm text-gray-600">Curtidas recebidas</p>
          </div>
        </div>

        {/* Adicionar seção de reviews após as estatísticas */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Minhas Reviews</h3>
          
          {reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Você ainda não publicou nenhuma review</p>
              <Link
                href="/new-review"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Criar primeira review
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{review.apartments.address}</h4>
                    <div className="text-yellow-400">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {review.apartments.city}, {review.apartments.state}
                  </p>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3">{review.comment}</p>
                  
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Foto ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-4 text-sm">
                    <span className="text-gray-500">
                      {new Date(review.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <button
                      onClick={() => handleShowDetails(review)}
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seção de Ações */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Ações da conta</h3>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/reviews')}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Minhas Reviews</span>
            </button>

            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 flex items-center space-x-3 text-red-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sair da conta</span>
            </button>
          </div>
        </div>
      </div>

      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6">
              <ReviewModal
                review={selectedReview}
                username={username}
                currentUserId={currentUserId}
                userMap={userMap}
                selectedCommentId={null}
                isDeleting={false}
                onDelete={async () => {
                  setShowModal(false)
                  await loadProfile() // Recarrega os dados após deletar
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 