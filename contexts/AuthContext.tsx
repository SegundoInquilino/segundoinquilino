'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { AuthError, Session, User } from '@supabase/supabase-js'

interface AuthContextType {
  currentUserId: string | null
  setCurrentUserId: (id: string | null) => void
  isLoading: boolean
  isSessionExpired: boolean
}

const AuthContext = createContext<AuthContextType>({
  currentUserId: null,
  setCurrentUserId: () => {},
  isLoading: true,
  isSessionExpired: false
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSessionExpired, setIsSessionExpired] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUserId(user?.id || null)
        setIsSessionExpired(false)
      } catch (error) {
        console.error('Erro ao verificar usuário:', error)
        setCurrentUserId(null)
        if ((error as AuthError)?.message?.includes('expired')) {
          setIsSessionExpired(true)
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event)
        
        switch (event) {
          case 'SIGNED_OUT':
            setIsSessionExpired(false)
            setCurrentUserId(null)
            break
          case 'SIGNED_IN':
            setIsSessionExpired(false)
            setCurrentUserId(session?.user?.id || null)
            break
          case 'INITIAL_SESSION':
            setIsSessionExpired(false)
            setCurrentUserId(session?.user?.id || null)
            break
          default:
            // Se não houver sessão e não for um dos eventos acima, consideramos expirada
            if (!session?.user) {
              setIsSessionExpired(true)
              setCurrentUserId(null)
            }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ 
      currentUserId, 
      setCurrentUserId, 
      isLoading,
      isSessionExpired 
    }}>
      {isSessionExpired && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Faça o login para continuar no site Segundo Inquilino.
              </p>
            </div>
          </div>
        </div>
      )}
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 