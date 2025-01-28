'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'
import DeleteCommentButton from '@/components/DeleteCommentButton'
import NewCommentForm from '../components/NewCommentForm'

interface Comment {
  id: string
  content: string
  created_at: string
  user_id: string
  username: string
  avatar_url?: string
  parent_id?: string | null
  replies?: Comment[]
  post_id: string
}

interface CommentsListProps {
  postId: string
}

function organizeComments(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment>()
  const roots: Comment[] = []

  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  commentMap.forEach(comment => {
    if (comment.parent_id && commentMap.has(comment.parent_id)) {
      const parent = commentMap.get(comment.parent_id)!
      parent.replies?.push(comment)
    } else {
      roots.push(comment)
    }
  })

  return roots
}

function CommentItem({ 
  comment, 
  level = 0,
  currentUserId,
  onReply,
  onCommentDeleted
}: { 
  comment: Comment
  level?: number
  currentUserId: string | null
  onReply: (parentId: string) => void
  onCommentDeleted: () => void
}) {
  const [isReplying, setIsReplying] = useState(false)

  return (
    <div className={`${level > 0 ? 'ml-8' : ''}`}>
      <div className="relative pl-4 border-l-2 border-gray-200">
        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-gray-900">
                  {comment.username}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500 text-sm">
                  {new Date(comment.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-line">
                {comment.content}
              </p>
              {currentUserId && (
                <button
                  onClick={() => setIsReplying(true)}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-700"
                >
                  Responder
                </button>
              )}
            </div>
            <DeleteCommentButton
              commentId={comment.id}
              commentAuthorId={comment.user_id}
              currentUserId={currentUserId}
              onCommentDeleted={onCommentDeleted}
            />
          </div>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              level={level + 1}
              currentUserId={currentUserId}
              onReply={onReply}
              onCommentDeleted={onCommentDeleted}
            />
          ))}
        </div>
      )}

      {isReplying && (
        <div className="mt-4">
          <NewCommentForm
            postId={comment.post_id}
            parentId={comment.id}
            onCommentAdded={() => {
              setIsReplying(false)
              onCommentDeleted()
            }}
            onCancelReply={() => setIsReplying(false)}
          />
        </div>
      )}
    </div>
  )
}

export default function CommentsList({ postId }: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const { currentUserId } = useAuth()
  const supabase = createClient()
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  useEffect(() => {
    if (postId) {
      loadComments()
    }
  }, [postId])

  const loadComments = async () => {
    try {
      setLoading(true)
      console.log('Carregando comentários para o post:', postId)
      
      const { data, error } = await supabase
        .from('forum_comments_with_users')
        .select(`
          id,
          content,
          created_at,
          user_id,
          username,
          avatar_url,
          parent_id,
          post_id
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erro do Supabase:', error)
        throw new Error(error.message || 'Erro ao carregar comentários')
      }

      console.log('Comentários carregados:', data)
      setComments(data || [])
    } catch (error) {
      console.error('Erro ao carregar comentários:', error)
      const message = error instanceof Error ? error.message : 'Erro ao carregar comentários'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const organizedComments = organizeComments(comments)

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-2 mb-3">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 bg-gray-200 rounded w-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600">
          Nenhum comentário ainda. Seja o primeiro a comentar!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {organizedComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onReply={setReplyingTo}
          onCommentDeleted={loadComments}
        />
      ))}
    </div>
  )
} 