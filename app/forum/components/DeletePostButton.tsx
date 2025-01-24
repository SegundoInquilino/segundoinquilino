'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { toast } from 'react-hot-toast'
import { TrashIcon } from '@heroicons/react/24/outline'

interface DeletePostButtonProps {
  postId: string
  postAuthorId: string
  currentUserId?: string
}

export default function DeletePostButton({ 
  postId, 
  postAuthorId, 
  currentUserId 
}: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = createClient()

  // Só mostra o botão se o usuário atual for o autor do post
  if (currentUserId !== postAuthorId) return null

  const handleDelete = async () => {
    // Confirmação antes de deletar
    if (!window.confirm('Tem certeza que deseja excluir este post?')) {
      return
    }

    try {
      setIsDeleting(true)

      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', currentUserId) // Garantia extra de que só o autor pode deletar

      if (error) throw error

      toast.success('Post excluído com sucesso!')
      
      // Recarregar a página para atualizar a lista
      window.location.reload()
    } catch (error) {
      console.error('Erro ao excluir post:', error)
      toast.error('Erro ao excluir post. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2 rounded-full hover:bg-red-50 transition-colors"
      title="Excluir post"
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  )
} 