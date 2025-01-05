'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import ReviewsList from '@/components/ReviewsList'
import ReviewFilters from '@/components/ReviewFilters'
import Link from 'next/link'
import type { Review } from '@/types/review'
import ReviewModal from '@/components/ReviewModal'
import { useAuth } from '@/contexts/AuthContext'

interface Filters {
  search?: string
  city?: string
  rating?: number | 'all'
  orderBy?: 'recent' | 'rating' | 'likes'
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const { currentUserId, setCurrentUserId } = useAuth()
  const [userMap, setUserMap] = useState<Record<string, string>>({})
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null)
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const supabase = createClient()
      
      // Carregar usuário atual
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)

      // Carregar reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select(`
          *,
          apartments (*),
          likes_count:review_likes(count)
        `)
        .order('created_at', { ascending: false })

      if (reviewsData) {
        setReviews(reviewsData as Review[])

        // Carregar userMap
        const userIds = Array.from(new Set(reviewsData.map(r => r.user_id)))
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds)

        const newUserMap: Record<string, string> = {}
        profiles?.forEach(profile => {
          newUserMap[profile.id] = profile.username || 'Usuário'
        })
        setUserMap(newUserMap)
      }
    } catch (error) {
      console.error('Erro ao carregar reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Verificar parâmetros da URL
    const params = new URLSearchParams(window.location.search)
    const reviewId = params.get('reviewId')
    const commentId = params.get('commentId')
    const showModalParam = params.get('showModal')

    if (reviewId && showModalParam === 'true') {
      // Buscar a review específica
      const fetchReview = async () => {
        const supabase = createClient()
        const { data } = await supabase
          .from('reviews')
          .select(`
            *,
            apartments (*),
            likes_count:review_likes(count)
          `)
          .eq('id', reviewId)
          .single()

        if (data) {
          setSelectedReview(data as Review)
          setSelectedCommentId(commentId)
          setShowModal(true)
        }
      }

      fetchReview()
    }
  }, [])

  useEffect(() => {
    if (selectedReviewId) {
      const review = reviews.find(r => r.id === selectedReviewId)
      if (review) {
        setSelectedReview(review)
        setShowModal(true)
      }
    }
  }, [selectedReviewId, reviews])

  const handleFilterChange = async (filters: Filters) => {
    const supabase = createClient()
    
    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          apartments!inner (*),
          likes_count:review_likes(count)
        `)

      // Aplicar filtros de busca
      if (filters.search?.trim()) {
        const searchTerm = filters.search.trim()
        query = query.filter('apartments.address', 'ilike', `%${searchTerm}%`)
      }

      // Filtro por cidade
      if (filters.city && filters.city !== 'all') {
        // Ajustar para case insensitive e match parcial
        query = query.ilike('apartments.city', `%${filters.city}%`)
      }

      // Filtro por avaliação
      if (filters.rating && typeof filters.rating === 'number') {
        query = query.gte('rating', filters.rating)
      }

      // Aplicar ordenação
      switch (filters.orderBy) {
        case 'rating':
          query = query.order('rating', { ascending: false })
          break
        case 'likes':
          query = query.order('likes_count', { ascending: false, nullsFirst: false })
          break
        default:
          query = query.order('created_at', { ascending: false })
      }

      console.log('Query de filtro:', query) // Debug

      const { data, error } = await query

      if (error) {
        console.error('Erro na query:', error)
        throw error
      }

      if (data) {
        console.log('Resultados encontrados:', data.length)
        setReviews(data as Review[])

        // Atualizar userMap para os novos resultados
        const userIds = Array.from(new Set(data.map(r => r.user_id)))
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds)

        const newUserMap: Record<string, string> = {}
        profiles?.forEach(profile => {
          newUserMap[profile.id] = profile.username || 'Usuário'
        })
        setUserMap(newUserMap)
      }
    } catch (error) {
      console.error('Erro ao filtrar reviews:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
        <div className="container mx-auto px-4 text-center">
          Carregando reviews...
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Todas as Reviews</h1>
          <Link
            href="/new-review"
            className="inline-flex items-center px-6 py-2 text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <span>Nova Review</span>
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>
        </div>

        {/* Filtros */}
        <ReviewFilters onFilterChange={handleFilterChange} />

        {/* Reviews List */}
        <ReviewsList
          reviews={reviews}
          userMap={userMap}
          currentUserId={currentUserId}
          onReviewDeleted={() => {
            loadReviews()
          }}
        />
      </div>

      {/* Modal */}
      {showModal && selectedReview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowModal(false)
            setSelectedReview(null)
            setSelectedCommentId(null)
          }}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header do Modal com botão de fechar */}
            <div className="flex justify-end p-2 border-b">
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedReview(null)
                  setSelectedCommentId(null)
                }}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Fechar modal"
              >
                <svg 
                  className="w-5 h-5 text-gray-500"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>

            {/* Conteúdo do Modal com scroll */}
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
              <ReviewModal
                review={selectedReview}
                username={userMap[selectedReview.user_id] || ''}
                currentUserId={currentUserId}
                userMap={userMap}
                selectedCommentId={selectedCommentId}
                onClose={() => {
                  setShowModal(false)
                  setSelectedReview(null)
                  setSelectedCommentId(null)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
} 