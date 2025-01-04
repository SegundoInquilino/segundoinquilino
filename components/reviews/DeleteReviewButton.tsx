'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface DeleteReviewButtonProps {
  reviewId: string
}

export default function DeleteReviewButton({ reviewId }: DeleteReviewButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta review?')) {
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)

    if (error) {
      alert('Erro ao excluir review: ' + error.message)
    } else {
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {loading ? 'Excluindo...' : 'Excluir Review'}
    </button>
  )
} 