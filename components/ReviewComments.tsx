'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2, MoreVertical } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/utils/string'

interface ReviewCommentsProps {
  reviewId: string
  currentUserId?: string | null
  userMap: Record<string, string>
  selectedCommentId?: string | null
}

interface CommentAuthor {
  id: string
  username: string
  full_name?: string
}

interface Comment {
  id: string
  user_id: string
  review_id: string
  comment: string
  created_at: string
  profiles?: {
    username: string
    full_name?: string
    avatar_url?: string
  }
}

export default function ReviewComments({ 
  reviewId, 
  currentUserId, 
  userMap,
  selectedCommentId
}: ReviewCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadComments()
  }, [reviewId])

  useEffect(() => {
    if (selectedCommentId) {
      const element = document.getElementById(`comment-${selectedCommentId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [selectedCommentId])

  const loadComments = async () => {
    try {
      const { data: commentsData } = await supabase
        .from('review_comments')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name
          )
        `)
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true })

      if (commentsData) {
        setComments(commentsData)
      }
    } catch (error) {
      console.error('Erro ao carregar comentários:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId || !newComment.trim()) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('review_comments')
        .insert({
          review_id: reviewId,
          user_id: currentUserId,
          comment: newComment.trim()
        })

      if (error) throw error

      // Após adicionar o comentário com sucesso
      const { data: reviewData } = await supabase
        .from('reviews')
        .select('id, user_id, apartment_id')
        .eq('id', reviewId)
        .single()

      if (reviewData) {
        // Buscar dados do autor
        const { data: authorData } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', reviewData.user_id)
          .single()

        // Buscar dados do apartamento
        const { data: apartmentData } = await supabase
          .from('apartments')
          .select('building_name')
          .eq('id', reviewData.apartment_id)
          .single()

        console.log('Dados do review:', {
          reviewData,
          currentUserId,
          email: authorData?.email,
          authorName: authorData?.full_name,
          buildingName: apartmentData?.building_name
        })

        // Só envia email se o comentário for de outro usuário e tiver email
        if (reviewData.user_id !== currentUserId && authorData?.email) {
          try {
            const { data: commenterData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', currentUserId)
              .single()

            console.log('Dados do comentarista:', commenterData)

            const response = await fetch('/api/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to: authorData.email,
                reviewAuthor: authorData.full_name || 'Usuário',
                commenterName: commenterData?.full_name || 'Usuário',
                reviewTitle: apartmentData?.building_name || 'Imóvel',
                commentText: newComment
              })
            })

            const responseData = await response.json()
            if (!response.ok) {
              throw new Error(`Erro ao enviar email: ${responseData.error}`)
            }
            console.log('Email enviado com sucesso')
          } catch (error) {
            console.error('Erro ao enviar notificação:', error)
          }
        }
      }

      setNewComment('')
      loadComments()
    } catch (error) {
      console.error('Erro ao comentar:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const comment = comments.find(c => c.id === commentId)
      if (!comment) throw new Error('Comentário não encontrado')
      
      if (currentUserId !== comment.user_id) {
        throw new Error('Você só pode deletar seus próprios comentários')
      }

      // Com ON DELETE CASCADE, só precisamos deletar o comentário
      const { error } = await supabase
        .from('review_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', currentUserId)

      if (error) {
        console.error('Erro ao deletar comentário:', error)
        throw error
      }

      setComments(prev => prev.filter(c => c.id !== commentId))
      setMenuOpen(null)

    } catch (error) {
      console.error('Erro ao deletar comentário:', error)
    }
  }

  const canDeleteComment = (commentUserId: string) => {
    return currentUserId === commentUserId
  }

  if (loading) return <div className="text-center py-4">Carregando comentários...</div>

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Comentários ({comments.length})
      </h3>

      {/* Lista de comentários */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div 
            key={comment.id}
            id={`comment-${comment.id}`}
            className={`p-4 rounded-lg ${
              comment.id === selectedCommentId 
                ? 'bg-blue-50 border border-blue-200' 
                : 'bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.profiles?.avatar_url || ''} />
                  <AvatarFallback className="bg-black text-white font-bold">
                    {getInitials(userMap[comment.user_id] || 'Usuário')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">
                      {comment.profiles?.full_name || comment.profiles?.username || userMap[comment.user_id] || 'Usuário'}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 break-words">
                    {comment.comment}
                  </p>
                </div>
              </div>

              {/* Menu de ações */}
              {canDeleteComment(comment.user_id) && (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === comment.id ? null : comment.id)}
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>

                  {menuOpen === comment.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteComment(comment.id)
                        }}
                        className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Deletar comentário</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Formulário de novo comentário */}
      {currentUserId && (
        <div className="sticky bottom-0 bg-white pt-2 pb-4">
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
            <button
              onClick={handleSubmit}
              disabled={!newComment.trim()}
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              Comentar
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 