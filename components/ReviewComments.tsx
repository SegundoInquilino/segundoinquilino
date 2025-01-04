'use client'

import { useState, useEffect, useCallback } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { createClient } from '@/utils/supabase-client'

interface Profile {
  username: string
}

interface Comment {
  id: string
  review_id: string
  user_id: string
  comment: string
  created_at: string
  parent_id?: string
  profiles?: Profile
  replies?: Comment[]
}

interface CommentItemProps {
  comment: Comment
  currentUserId?: string | null
  userMap: Record<string, string>
  onDelete: (id: string) => Promise<void>
  onReply: (parentId: string, text: string) => Promise<void>
  level?: number
  isHighlighted?: boolean
}

interface ReviewCommentsProps {
  reviewId: string
  review: {
    id: string
    user_id: string
  }
  currentUserId?: string | null
  userMap: Record<string, string>
  selectedCommentId?: string | null
}

// Componente para um único comentário
function CommentItem({ 
  comment, 
  currentUserId, 
  userMap, 
  onDelete, 
  onReply, 
  level = 0,
  isHighlighted = false
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getUsername = (userId: string) => {
    return comment.profiles?.username || userMap[userId] || 'Usuário'
  }

  useEffect(() => {
    console.log('CommentItem - userMap:', userMap)
    console.log('CommentItem - userId:', comment.user_id)
    console.log('CommentItem - username:', getUsername(comment.user_id))
  }, [userMap, comment.user_id])

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setIsSubmitting(true)
    try {
      await onReply(comment.id, replyText)
      setReplyText('')
      setIsReplying(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    console.log('Dados do comentário:', {
      comment,
      profiles: comment.profiles,
      username: getUsername(comment.user_id)
    })
  }, [comment])

  return (
    <div className={`${level > 0 ? 'ml-8 mt-4' : ''}`}>
      <div className={`
        p-4 rounded-lg transition-colors
        ${isHighlighted 
          ? 'bg-blue-50 border-2 border-blue-200' 
          : 'bg-gray-50'
        }
      `}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm text-gray-700">
                {getUsername(comment.user_id)}
              </p>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{comment.comment}</p>
          </div>
          <div className="flex items-center gap-2">
            {currentUserId && level < 3 && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Responder
              </button>
            )}
            {currentUserId === comment.user_id && (
              <button
                onClick={() => onDelete(comment.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Excluir
              </button>
            )}
          </div>
        </div>
      </div>

      {isReplying && (
        <form onSubmit={handleReply} className="mt-4">
          <div className="flex flex-col space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Escreva sua resposta..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Responder'}
              </button>
            </div>
          </div>
        </form>
      )}

      {comment.replies?.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          currentUserId={currentUserId}
          userMap={userMap}
          onDelete={onDelete}
          onReply={onReply}
          level={level + 1}
        />
      ))}
    </div>
  )
}

export default function ReviewComments({ 
  reviewId, 
  review, 
  currentUserId, 
  userMap = {},
  selectedCommentId 
}: ReviewCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  const loadComments = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true)
      
      // Buscar comentários
      const { data, error } = await supabase
        .from('review_comments')
        .select(`
          id,
          comment,
          created_at,
          user_id,
          parent_id,
          profiles!user_id (
            username
          )
        `)
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true })

      if (error) throw error

      // Organizar comentários em árvore
      const commentsTree = data?.reduce((acc: Comment[], comment) => {
        if (!comment.parent_id) {
          acc.push({
            ...comment,
            profiles: {
              username: comment.profiles?.[0]?.username || userMap[comment.user_id] || 'Usuário'
            },
            replies: data
              .filter(c => c.parent_id === comment.id)
              .map(reply => ({
                ...reply,
                review_id: reviewId,
                profiles: {
                  username: reply.profiles?.[0]?.username || userMap[reply.user_id] || 'Usuário'
                }
              }))
          })
        }
        return acc
      }, []) || []

      setComments(commentsTree)
      setError('')
    } catch (error) {
      console.error('Erro ao carregar comentários:', error)
      setError('Não foi possível carregar os comentários.')
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }, [reviewId, userMap])

  useEffect(() => {
    loadComments(true)
  }, [loadComments])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId || !newComment.trim()) return

    setIsSubmitting(true)
    setError('')

    try {
      // Criar comentário
      const { data: commentData, error: commentError } = await supabase
        .from('review_comments')
        .insert({
          review_id: reviewId,
          user_id: currentUserId,
          comment: newComment.trim()
        })
        .select('*, profiles:user_id(username)')
        .single()

      if (commentError) throw commentError

      // Criar notificação
      if (review.user_id !== currentUserId) {
        await supabase
          .from('notifications')
          .insert({
            user_id: review.user_id,
            review_id: reviewId,
            comment_id: commentData.id,
            from_user_id: currentUserId
          })
      }

      setNewComment('')
      await loadComments(false)
    } catch (error) {
      console.error('Erro ao criar comentário:', error)
      setError('Erro ao enviar comentário.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    if (!currentUserId) return

    try {
      const { error } = await supabase
        .from('review_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', currentUserId)

      if (error) throw error
      await loadComments(false)
    } catch (error) {
      console.error('Erro ao deletar comentário:', error)
      setError('Erro ao deletar comentário.')
    }
  }

  const handleReply = async (parentId: string, text: string) => {
    if (!currentUserId) return

    try {
      const { error } = await supabase
        .from('review_comments')
        .insert({
          review_id: reviewId,
          user_id: currentUserId,
          comment: text,
          parent_id: parentId
        })

      if (error) throw error
      await loadComments(false)
    } catch (error) {
      console.error('Erro ao responder comentário:', error)
      setError('Erro ao responder comentário.')
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Carregando comentários...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comentários ({comments.length})</h3>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {/* Lista de comentários */}
      <div className="space-y-4">
        {comments
          .filter(comment => !comment.parent_id) // Mostrar apenas comentários principais
          .map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              userMap={userMap}
              onDelete={handleDelete}
              onReply={handleReply}
            />
          ))}

        {comments.length === 0 && !isLoading && (
          <p className="text-gray-500 text-center py-4">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        )}
      </div>

      {/* Formulário de novo comentário */}
      {currentUserId ? (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex flex-col space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva seu comentário..."
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="self-end bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Comentar'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-center text-gray-500 mt-4">
          Faça login para comentar
        </p>
      )}
    </div>
  )
} 