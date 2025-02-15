'use client'

import { useState } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/Logo_SI.png?v=2"
            alt="Segundo Inquilino Logo"
            width={400}
            height={400}
            className="h-auto w-auto"
            priority
          />
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {isLogin ? <LoginForm /> : <RegisterForm />}
            
            <div className="mt-6 space-y-4">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-500"
              >
                {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Entre'}
              </button>

              <div className="text-center text-xs text-gray-500">
                Ao continuar, você concorda com nossos{' '}
                <Link 
                  href="/terms" 
                  className="text-purple-600 hover:text-purple-500 hover:underline"
                >
                  Termos e Condições
                </Link>
                <span className="mx-1">•</span>
                <Link 
                  href="/about" 
                  className="text-purple-600 hover:text-purple-500 hover:underline"
                >
                  Sobre
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 