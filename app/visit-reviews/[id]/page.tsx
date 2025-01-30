'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase-client'

export default function VisitReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    const redirectToReviews = async () => {
      const supabase = createClient()
      
      // Verifica se a review existe
      const { data: review } = await supabase
        .from('visit_reviews')
        .select('id')
        .eq('id', id)
        .single()

      // Redireciona para a página de reviews com o ID na URL
      router.replace(`/visit-reviews?review=${id}`)
    }

    redirectToReviews()
  }, [id, router])

  return null // Esta página apenas redireciona
} 