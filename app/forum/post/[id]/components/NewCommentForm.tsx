'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'

interface NewCommentFormProps {
  postId: string
  parentId?: string | null
  onCommentAdded: () => void
  onCancelReply?: () => void
}

export default function NewCommentForm({ postId, parentId, onCommentAdded, onCancelReply }: NewCommentFormProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { currentUserId } = useAuth()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUserId) {
      toast.error('Você precisa estar logado para comentar')
      return
    }

    if (!postId) {
      toast.error('ID do post inválido')
      return
    }

    try {
      setIsSubmitting(true)

      const { error } = await supabase
        .from('forum_comments')
        .insert({
          content,
          post_id: postId,
          user_id: currentUserId,
          parent_id: parentId || null
        })
        .select()

      if (error) {
        console.error('Erro do Supabase:', error)
        throw new Error(error.message || 'Erro ao adicionar comentário')
      }

      toast.success('Comentário adicionado com sucesso!')
      setContent('')
      onCommentAdded()
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error)
      const message = error instanceof Error ? error.message : 'Erro ao adicionar comentário. Tente novamente.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <label 
          htmlFor="comment" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {parentId ? 'Responder ao comentário' : 'Deixe seu comentário'}
        </label>
        <textarea
          id="comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-shadow"
          rows={4}
          required
          minLength={3}
          maxLength={1000}
          placeholder={parentId ? 'Escreva sua resposta...' : 'O que você pensa sobre isso?'}
        />
      </div>
      <div className="flex justify-end space-x-3">
        {onCancelReply && (
          <button
            type="button"
            onClick={onCancelReply}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </>
          ) : (
            parentId ? 'Enviar resposta' : 'Enviar comentário'
          )}
        </button>
      </div>
    </form>
  )
} 