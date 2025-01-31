'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase-client'

export default function SuccessPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Forçar atualização do status de verificação
        await supabase.from('profiles')
          .update({ email_confirmed_at: new Date().toISOString() })
          .eq('id', session.user.id)
          
        // Redirecionar para home após 3 segundos
        setTimeout(() => router.push('/home'), 3000)
      }
    }

    checkSession()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email confirmado!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sua conta foi verificada com sucesso. Você será redirecionado em alguns segundos...
          </p>
        </div>
      </div>
    </div>
  )
} 