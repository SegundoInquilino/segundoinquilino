'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase-client'

export default function OAuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()
      
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        if (user) {
          router.push('/home')
        } else {
          router.push('/auth')
        }
      } catch (error) {
        console.error('Erro no callback do OAuth:', error)
        router.push('/auth')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Processando seu login...
        </h1>
        <p className="text-gray-600">
          Por favor, aguarde enquanto finalizamos seu login.
        </p>
      </div>
    </div>
  )
} 