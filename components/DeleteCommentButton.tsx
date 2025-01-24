import { useState } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface DeleteCommentButtonProps {
  commentId: string
  commentAuthorId: string
  currentUserId: string | null
  onCommentDeleted?: () => void
}

export default function DeleteCommentButton({
  commentId,
  commentAuthorId,
  currentUserId,
  onCommentDeleted
}: DeleteCommentButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (isDeleting) return
    
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/forum/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast.success('Comentário excluído com sucesso')
        if (onCommentDeleted) {
          onCommentDeleted()
        }
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao excluir comentário')
      }
    } catch (error) {
      console.error('Erro ao excluir comentário:', error)
      toast.error('Não foi possível excluir o comentário')
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  if (currentUserId !== commentAuthorId) return null

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-gray-400 hover:text-red-500 transition-colors"
        title="Excluir comentário"
      >
        <TrashIcon className="h-4 w-4" />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-fade-in">
            {/* Cabeçalho */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="bg-red-100 rounded-full p-2">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Excluir Comentário
                </h3>
              </div>
            </div>

            {/* Corpo */}
            <div className="p-6">
              <p className="text-gray-600">
                Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.
              </p>
            </div>

            {/* Botões */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2.5 text-gray-700 font-medium hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-colors"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2.5 text-white font-medium bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center shadow-sm"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4 mr-2" />
                    <span>Excluir Comentário</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 