'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash2, MoreVertical } from 'lucide-react'

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

      setNewComment('')
      loadComments() // Recarregar comentários
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
    console.log('Verificando permissão:', {
      currentUserId,
      commentUserId,
      isOwner: currentUserId === commentUserId
    })
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
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-medium">
                  {(comment.profiles?.full_name || comment.profiles?.username || userMap[comment.user_id] || 'U')[0].toUpperCase()}
                </div>
                
                {/* Conteúdo do comentário */}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {comment.profiles?.full_name || comment.profiles?.username || userMap[comment.user_id] || 'Usuário'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{comment.comment}</p>
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
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
} 