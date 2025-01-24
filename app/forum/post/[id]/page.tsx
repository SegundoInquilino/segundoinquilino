'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import NewCommentForm from './components/NewCommentForm'
import CommentsList from './components/CommentsList'
import { useParams, useRouter } from 'next/navigation'
import DeletePostButton from '@/components/DeletePostButton'

interface ForumPost {
  id: string
  title: string
  content: string
  user_id: string
  created_at: string
  category: string
  user?: {
    username: string
    avatar_url?: string
  } | null
}

export default function PostPage() {
  const { currentUserId } = useAuth()
  const [post, setPost] = useState<ForumPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentsKey, setCommentsKey] = useState(0)
  const params = useParams()
  const router = useRouter()
  const postId = params?.id as string

  useEffect(() => {
    if (postId) {
      loadPost()
    }
  }, [postId])

  const loadPost = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`/api/forum/post/${postId}`)
      const data = await response.json()
      
      if (!response.ok) {
        console.error('Erro na resposta:', data)
        throw new Error(data.error || 'Erro ao carregar post')
      }
      
      if (!data.post) {
        throw new Error('Post não encontrado')
      }

      setPost(data.post)

    } catch (error) {
      console.error('Erro ao carregar post:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Não foi possível carregar o post'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCommentAdded = () => {
    setCommentsKey(prev => prev + 1)
  }

  const handlePostDeleted = () => {
    router.push('/forum')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
          <Link 
            href="/forum"
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            ← Voltar para o fórum
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Navegação */}
        <Link 
          href="/forum"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 group"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Voltar para o fórum
        </Link>
        
        {/* Cabeçalho e Título */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
            <DeletePostButton 
              postId={post.id}
              postAuthorId={post.user_id}
              currentUserId={currentUserId}
              onPostDeleted={handlePostDeleted}
            />
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="font-medium text-gray-900">{post.user?.username}</span>
            <span>•</span>
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Conteúdo e Comentários em uma única coluna */}
        <div className="space-y-4">
          {/* Conteúdo do Post */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{post.content}</p>
            </div>
          </div>

          {/* Área de Comentários */}
          <div className="bg-gray-50 rounded-lg p-6">
            {currentUserId && (
              <div className="mb-6">
                <NewCommentForm 
                  postId={post?.id || ''}
                  onCommentAdded={handleCommentAdded}
                />
              </div>
            )}
            
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Comentários
              </h2>
              <CommentsList 
                key={commentsKey}
                postId={post.id} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 