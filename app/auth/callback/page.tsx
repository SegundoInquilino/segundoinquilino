'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession()
        if (error) throw error
        router.push('/reviews')
      } catch (error) {
        console.error('Erro no callback:', error)
        router.push('/auth/error')
      }
    }

    handleCallback()
  }, [router])

  return <div>Redirecionando...</div>
} 