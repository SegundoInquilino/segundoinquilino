'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import LoginForm from '@/components/auth/LoginForm'
import Image from 'next/image'
import Link from 'next/link'

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/Logo_SI.png"
            alt="Segundo Inquilino Logo"
            width={150}
            height={150}
            className="h-auto w-auto"
            priority
          />
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Entre na sua conta
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginForm />
            
            <div className="mt-6">
              <div className="text-center text-xs text-gray-500">
                Ao continuar, você concorda com nossos{' '}
                <Link 
                  href="/terms" 
                  className="text-purple-600 hover:text-purple-500 hover:underline"
                >
                  Termos e Condições
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 