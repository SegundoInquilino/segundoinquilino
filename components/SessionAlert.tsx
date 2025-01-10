'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase-client'

export default function SessionAlert() {
  const [showAlert, setShowAlert] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session && localStorage.getItem('hadPreviousSession') === 'true') {
        setShowAlert(true)
      }
    }

    // Verificar a sessão quando o componente montar
    checkSession()

    // Monitorar mudanças na sessão
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        localStorage.setItem('hadPreviousSession', 'true')
        setShowAlert(false)
      } else if (event === 'SIGNED_OUT') {
        // Não mostrar o alerta em caso de logout manual
        localStorage.removeItem('hadPreviousSession')
        setShowAlert(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!showAlert) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2">
              <svg 
                className="h-6 w-6 text-yellow-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </span>
            <p className="ml-3 font-medium text-yellow-700">
              Faça o login para continuar no site Segundo Inquilino.
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={() => router.push('/auth')}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Fazer Login
            </button>
          </div>
          <button
            onClick={() => setShowAlert(false)}
            className="ml-3"
          >
            <span className="sr-only">Fechar</span>
            <svg 
              className="h-6 w-6 text-yellow-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
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
      </div>
    </div>
  )
} 