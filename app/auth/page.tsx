'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import LoginForm from '@/components/auth/LoginForm'

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  useEffect(() => {
    const handleCode = async () => {
      if (code) {
        try {
          const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) throw error

          if (session) {
            // Se tiver sessão, redireciona para reviews
            window.location.href = '/reviews'
          }
        } catch (error) {
          console.error('Erro ao processar código:', error)
        }
      }
    }

    handleCode()
  }, [code])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm />
    </div>
  )
} 