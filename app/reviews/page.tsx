'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import ReviewsList from '@/components/ReviewsList'
import ReviewFilters from '@/components/ReviewFilters'
import Link from 'next/link'
import type { Review } from '@/types/review'
import ReviewModal from '@/components/ReviewModal'
import { useAuth } from '@/contexts/AuthContext'
import ReviewCard from '@/components/ReviewCard'

interface Filters {
  search?: string
  city?: string
  rating?: number | undefined
  orderBy?: 'recent' | 'rating' | 'likes'
  amenities?: string[]
  rental_source?: string
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

    // Adicionar listener para atualização
    const handleReviewDeleted = (event: CustomEvent) => {
      const { reviewId } = event.detail
      setReviews(prev => prev.filter(review => review.id !== reviewId))
      setShowModal(false)
      setSelectedReview(null)
    }

    window.addEventListener('reviewDeleted', handleReviewDeleted as EventListener)

    return () => {
      window.removeEventListener('reviewDeleted', handleReviewDeleted as EventListener)
    }
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
        .is('request_id', null)
        .order('created_at', { ascending: false })

      if (reviewsData) {
        // Buscar usuários para os nomes (mesma lógica da home)
        const userIds = Array.from(new Set(reviewsData.map(r => r.user_id)))
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds)

        // Criar mapa de usuários
        const newUserMap: Record<string, string> = {}
        profiles?.forEach(profile => {
          newUserMap[profile.id] = profile.username || 'Usuário'
        })

        setUserMap(newUserMap)
        setReviews(reviewsData as Review[])
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
      const { data } = await supabase
        .from('reviews')
        .select(`
          *,
          apartments (*),
          likes_count:review_likes(count)
        `)

      if (data) {
        let filtered = data

        // Primeiro aplicar o filtro de rating
        if (typeof filters.rating === 'number') {
          filtered = filtered.filter(review => review.rating >= filters.rating!)
          // Ordenar por rating de forma crescente quando filtrado por rating
          filtered = [...filtered].sort((a, b) => a.rating - b.rating)
        } else {
          // Aplicar ordenação padrão quando não há filtro de rating
          if (filters.orderBy) {
            filtered = [...filtered].sort((a, b) => {
              switch (filters.orderBy) {
                case 'recent':
                  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                case 'rating':
                  return b.rating - a.rating
                case 'likes':
                  const likesA = typeof a.likes_count === 'number' ? a.likes_count : a.likes_count.count
                  const likesB = typeof b.likes_count === 'number' ? b.likes_count : b.likes_count.count
                  return likesB - likesA
                default:
                  return 0
              }
            })
          }
        }

        // Depois aplicar os outros filtros
        if (filters.search?.trim()) {
          const searchTerm = filters.search.trim().toLowerCase()
          filtered = filtered.filter(review => 
            review.apartments.building_name?.toLowerCase().includes(searchTerm) ||
            review.apartments.address.toLowerCase().includes(searchTerm) ||
            review.apartments.neighborhood.toLowerCase().includes(searchTerm)
          )
        }

        if (filters.city && filters.city !== 'all') {
          filtered = filtered.filter(review =>
            review.apartments.city.toLowerCase().includes(filters.city!.toLowerCase())
          )
        }

        if (filters.amenities?.length) {
          filtered = filtered.filter(review =>
            filters.amenities!.every(amenity => 
              review.amenities?.includes(amenity)
            )
          )
        }

        if (filters.rental_source) {
          filtered = filtered.filter(review => 
            review.rental_source === filters.rental_source
          )
        }

        setReviews(filtered as Review[])
      }
    } catch (error) {
      console.error('Erro ao filtrar reviews:', error)
    }
  }

  const handleReviewDeleted = (reviewId: string) => {
    setReviews(prevReviews => prevReviews.filter(review => review.id !== reviewId))
    // Fechar o modal se estiver aberto
    setShowModal(false)
    setSelectedReview(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen py-16 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="container px-4 mx-auto text-center">
          Carregando reviews...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 px-1">
            Reviews de Imóveis
          </h1>
          <Link
            href="/new-review"
            className="w-full sm:w-auto text-center inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
          >
            Nova Review
          </Link>
        </div>

        <ReviewFilters onFilterChange={handleFilterChange} />
        
        <ReviewsList
          reviews={reviews}
          userMap={userMap}
          currentUserId={currentUserId}
          onReviewDeleted={handleReviewDeleted}
          layout="square"
        />
      </div>

      {/* Modal */}
      {showModal && selectedReview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={() => {
            setShowModal(false)
            setSelectedReview(null)
            setSelectedCommentId(null)
          }}
        >
          <div 
            className="flex flex-col w-full max-w-xl bg-white rounded-lg"
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
                className="p-2 transition-colors rounded-full hover:bg-gray-100"
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
                review={{
                  ...selectedReview,
                  likes_count: selectedReview.likes_count || { count: 0 }
                }}
                username={userMap[selectedReview.user_id] || ''}
                currentUserId={currentUserId}
                userMap={userMap}
                selectedCommentId={selectedCommentId}
                onClose={() => setShowModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 