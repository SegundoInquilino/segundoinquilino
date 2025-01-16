'use client'

import { createClient } from '@/utils/supabase-client'
import { useState } from 'react'

export default function SignUpForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string

    try {
      const supabase = createClient()
      
      console.log('Iniciando signup para:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { name }
        }
      })

      console.log('Resposta do signup:', { data, error })

      if (error) {
        if (error.message === 'Email rate limit exceeded') {
          setError('Muitas tentativas de cadastro. Por favor, aguarde alguns minutos antes de tentar novamente.')
        } else {
          setError(error.message || 'Erro ao criar conta. Tente novamente.')
        }
        return
      }

      if (data?.user) {
        alert('Por favor, verifique seu email para confirmar o cadastro.')
      }
    } catch (error) {
      setError('Erro inesperado. Tente novamente em alguns minutos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignUp}>
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}
      {/* ... resto do formulário ... */}
    </form>
  )
} 