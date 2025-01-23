'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ReviewsList from '@/components/ReviewsList'
import ReviewModal from '@/components/ReviewModal'
import type { Review, Apartment } from '@/types/review'
import { useAuth } from '@/contexts/AuthContext'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'react-hot-toast'

interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string
}

interface UserMap {
  [key: string]: string
}

export default function ProfilePage() {
  const { currentUserId, setCurrentUserId } = useAuth()
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
  const [userMap, setUserMap] = useState<Record<string, string>>({})
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [fullName, setFullName] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }

      setCurrentUserId(user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, email, full_name, avatar_url')
        .eq('id', user.id)
        .single()

      if (profile) {
        setUsername(profile.username || '')
        setEmail(profile.email || '')
        setFullName(profile.full_name || '')
      }

      // Usar a mesma query das outras páginas
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          apartments (*),
          likes_count:review_likes(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (reviewsData) {
        setReviews(reviewsData as Review[])

        // Criar userMap
        const newUserMap: Record<string, string> = {}
        newUserMap[user.id] = profile?.username || 'Usuário'
        setUserMap(newUserMap)
      }

      // Buscar contagens
      const { count: comments } = await supabase
        .from('review_comments')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)

      const { count: likes } = await supabase
        .from('review_likes')
        .select('id', { count: 'exact' })
        .eq('user_id', user.id)

      setCommentsCount(comments || 0)
      setLikesCount(likes || 0)

    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      router.push('/auth')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName
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

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setCurrentUserId(null)
      window.location.href = '/auth'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    const supabase = createClient()

    try {
      // 1. Deletar reviews do usuário
      await supabase
        .from('reviews')
        .delete()
        .eq('user_id', supabase.auth.user()?.id)

      // 2. Deletar perfil do usuário
      await supabase
        .from('profiles')
        .delete()
        .eq('id', supabase.auth.user()?.id)

      // 3. Deletar conta do usuário
      const { error } = await supabase.auth.api.deleteUser(
        supabase.auth.user()?.id as string
      )

      if (error) throw error

      // 4. Fazer logout e redirecionar
      await supabase.auth.signOut()
      router.push('/')
      toast.success('Sua conta foi deletada com sucesso')
    } catch (error) {
      console.error('Erro ao deletar conta:', error)
      toast.error('Erro ao deletar conta. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
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

  if (!currentUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Faça login para acessar seu perfil
            </h1>
            <p className="text-gray-600 mb-6">
              Você precisa estar logado para ver e gerenciar seu perfil.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center px-6 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
                  {fullName ? fullName[0].toUpperCase() : username ? username[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {fullName || username || 'Seu Perfil'}
                  </h1>
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
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome de usuário
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    aria-label="Nome de usuário (não pode ser alterado)"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    O nome de usuário não pode ser alterado
                  </p>
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

            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Reviews</h3>
                <p className="text-3xl font-bold text-primary-600">{reviewsCount}</p>
                <p className="text-sm text-gray-600">Reviews publicadas</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Comentários</h3>
                <p className="text-3xl font-bold text-primary-600">{commentsCount}</p>
                <p className="text-sm text-gray-600">Comentários feitos</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Curtidas</h3>
                <p className="text-3xl font-bold text-primary-600">{likesCount}</p>
                <p className="text-sm text-gray-600">Curtidas recebidas</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Minhas Reviews</h2>
              <Link
                href="/new-review"
                className="inline-flex items-center px-6 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Nova Review
              </Link>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <p className="text-gray-600 mb-4">
                  Você ainda não publicou nenhuma review
                </p>
                <Link
                  href="/new-review"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Criar primeira review
                </Link>
              </div>
            ) : (
              <ReviewsList
                reviews={reviews}
                userMap={userMap}
                currentUserId={currentUserId}
                onReviewDeleted={() => {
                  loadProfile()
                }}
                layout="square"
              />
            )}
          </div>
        </div>

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
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 flex items-center space-x-3 text-red-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sair da conta</span>
            </button>
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Reviews Solicitadas</h2>
            <Link
              href="/my-reviews"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Ver Reviews Respondidas
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
          
          <p className="mt-2 text-gray-600">
            Veja todas as reviews que foram respondidas para suas solicitações.
          </p>
        </div>

        <div className="mt-12 border-t pt-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Zona de Perigo</h2>
          <p className="text-gray-600 mb-4">
            Ao deletar sua conta, todos os seus dados serão permanentemente removidos.
            Esta ação não pode ser desfeita.
          </p>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                disabled={isDeleting}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{isDeleting ? 'Deletando...' : 'Deletar Conta'}</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center space-x-2 text-2xl font-bold text-gray-900">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>Confirmar exclusão</span>
                </AlertDialogTitle>
                <AlertDialogDescription className="mt-4 text-gray-600 space-y-3">
                  <p>
                    Você está prestes a deletar sua conta permanentemente. Esta ação não pode ser desfeita.
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">O que será deletado:</h4>
                    <ul className="text-red-700 space-y-1">
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Seu perfil e informações pessoais
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Todas as suas reviews
                      </li>
                      <li className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Histórico de interações
                      </li>
                    </ul>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6 flex space-x-4">
                <AlertDialogCancel className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Sim, deletar minha conta</span>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
                review={{
                  ...selectedReview,
                  likes_count: selectedReview.likes_count || { count: 0 }
                }}
                username={username}
                currentUserId={currentUserId}
                userMap={userMap}
                selectedCommentId={null}
                isDeleting={false}
                onDelete={async () => {
                  setShowModal(false)
                  await loadProfile()
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 