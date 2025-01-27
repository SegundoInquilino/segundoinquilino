'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'
import NewPostButton from './components/NewPostButton'
import DeletePostButton from '@/components/DeletePostButton'
import Link from 'next/link'
import { categories } from './constants'

interface ForumPost {
  id: string
  title: string
  content: string
  user_id: string
  created_at: string
  user?: {
    username: string
    avatar_url?: string
  } | null
  category: string
}

export default function ForumPage() {
  const { currentUserId } = useAuth()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/forum')
      const data = await response.json()
      
      if (!response.ok) {
        console.error('Erro na API:', {
          status: response.status,
          data: data
        })
        throw new Error(
          data.details || data.error || 'Erro ao carregar posts'
        )
      }
      
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Erro ao carregar posts:', error)
      toast.error(
        error instanceof Error 
          ? error.message 
          : 'Erro interno ao carregar posts'
      )
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = selectedCategory
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fórum da Comunidade</h1>
            <p className="mt-2 text-gray-600">
              Compartilhe suas experiências e conecte-se com outros moradores
            </p>
          </div>
          <div className="flex items-center gap-4 self-stretch sm:self-auto">
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full sm:w-48 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm shadow-sm"
              >
                <option value="">Todas as categorias</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {currentUserId && <NewPostButton />}
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-7 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xl text-gray-600 mb-4">Nenhum post encontrado</p>
            {currentUserId && (
              <p className="text-gray-500">
                Seja o primeiro a criar um post!
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span 
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          getCategoryColor(post.category)
                        }`}
                      >
                        {post.category}
                      </span>
                    </div>
                    <Link 
                      href={`/forum/post/${post.id}`}
                      className="group"
                    >
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h2>
                    </Link>
                  </div>
                  <DeletePostButton 
                    postId={post.id}
                    postAuthorId={post.user_id}
                    currentUserId={currentUserId}
                    onPostDeleted={loadPosts}
                  />
                </div>
                <p className="text-gray-600 mt-3 mb-4 line-clamp-2">{post.content}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm gap-3 sm:gap-4">
                  <div className="flex items-center space-x-4 text-gray-500">
                    <span className="font-medium text-gray-900">
                      {post.user?.username}
                    </span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <Link 
                    href={`/forum/post/${post.id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors whitespace-nowrap"
                  >
                    Ver discussão
                    <svg 
                      className="w-4 h-4 ml-1 flex-shrink-0" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getCategoryColor(category: string): string {
  const colors = {
    'Segurança': 'bg-red-100 text-red-800',
    'Dicas': 'bg-green-100 text-green-800',
    'Eventos': 'bg-purple-100 text-purple-800',
    'Manutenção': 'bg-orange-100 text-orange-800',
    'Comunicados': 'bg-blue-100 text-blue-800',
    'Dúvidas': 'bg-yellow-100 text-yellow-800',
    'Sugestões': 'bg-indigo-100 text-indigo-800',
    'Outros': 'bg-gray-100 text-gray-800'
  }
  return colors[category as keyof typeof colors] || colors['Outros']
} 