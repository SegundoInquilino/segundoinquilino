'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { categories, PostCategory } from '../constants'

interface NewPostModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NewPostModal({ isOpen, onClose }: NewPostModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<PostCategory>('Outros')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { currentUserId } = useAuth()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUserId) {
      toast.error('Você precisa estar logado para criar um post')
      return
    }

    try {
      setIsSubmitting(true)
      console.log('Enviando post com categoria:', category)

      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          title,
          content,
          category,
          user_id: currentUserId
        })
        .select()
        .single()

      if (error) {
        console.error('Erro do Supabase:', error)
        throw new Error(error.message || 'Erro ao criar post')
      }

      toast.success('Post criado com sucesso!')
      onClose()
      setTitle('')
      setContent('')
      
      // Recarregar a página para mostrar o novo post
      window.location.reload()
    } catch (error) {
      console.error('Erro ao criar post:', error)
      const message = error instanceof Error ? error.message : 'Erro ao criar post. Tente novamente.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold mb-6">Criar Novo Post</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                minLength={3}
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Conteúdo
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={5}
                required
                minLength={10}
                maxLength={5000}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as PostCategory)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Criando...' : 'Criar Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 