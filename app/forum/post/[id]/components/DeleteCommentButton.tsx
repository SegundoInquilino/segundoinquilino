'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { toast } from 'react-hot-toast'
import { TrashIcon } from '@heroicons/react/24/outline'

interface DeleteCommentButtonProps {
  commentId: string
  commentAuthorId: string
  currentUserId?: string
}

export default function DeleteCommentButton({
  commentId,
  commentAuthorId,
  currentUserId
}: DeleteCommentButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  if (currentUserId !== commentAuthorId) return null

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este comentário?')) {
      return
    }

    try {
      setIsDeleting(true)

      const { error } = await supabase
        .from('forum_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', currentUserId)

      if (error) throw error

      toast.success('Comentário excluído com sucesso!')
      window.location.reload()
    } catch (error) {
      console.error('Erro ao excluir comentário:', error)
      toast.error('Erro ao excluir comentário')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-gray-400 hover:text-red-500 disabled:opacity-50 p-1.5 hover:bg-red-50 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      title="Excluir comentário"
    >
      {isDeleting ? (
        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <TrashIcon className="w-5 h-5" />
      )}
    </button>
  )
} 