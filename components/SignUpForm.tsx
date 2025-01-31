'use client'

import { createClient } from '@/utils/supabase-client'
import { useState } from 'react'
import ReCaptcha from './ReCaptcha'

const SUSPICIOUS_PATTERNS = [
  /[0-9]{8,}/, // Muitos números seguidos
  /(.)\1{4,}/, // Caracteres repetidos
  /^admin/i,   // Palavras suspeitas
]

export default function SignUpForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    name: string;
  } | null>(null)

  const handleInitialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)

    console.log('Formulário submetido, mostrando captcha')
    
    setFormData({
      email: data.get('email') as string,
      password: data.get('password') as string,
      name: data.get('name') as string
    })
    setShowCaptcha(true)
  }

  const validateInput = (data: { email: string; name: string }) => {
    // Verificar padrões suspeitos no nome
    if (SUSPICIOUS_PATTERNS.some(pattern => pattern.test(data.name))) {
      throw new Error('Nome de usuário inválido')
    }

    // Verificar domínio do email
    const [, domain] = data.email.split('@')
    if (domain) {
      const suspiciousDomains = ['tempmail', 'disposable', 'throwaway']
      if (suspiciousDomains.some(d => domain.includes(d))) {
        throw new Error('Este tipo de email não é permitido')
      }
    }

    // Verificar tempo de preenchimento
    if (Date.now() - formStartTime < 2000) { // menos de 2 segundos
      throw new Error('Por favor, preencha o formulário com mais calma')
    }
  }

  const handleSignUp = async () => {
    if (!formData || !captchaToken) return
    
    setLoading(true)
    setError(null)

    try {
      validateInput(formData)
      
      // Aumentar o threshold do reCAPTCHA para mais segurança
      const verifyCaptcha = await fetch('/api/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: captchaToken,
          minScore: 0.7 // Mais restritivo
        }),
      })

      const captchaResult = await verifyCaptcha.json()
      if (!captchaResult.success) {
        throw new Error('Verificação do captcha falhou')
      }

      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { name: formData.name },
          emailLinkExpiresIn: 24 * 60 * 60 // 24 horas em segundos
        }
      })

      if (error) {
        if (error.message === 'Email rate limit exceeded') {
          throw new Error('Muitas tentativas de cadastro. Por favor, aguarde alguns minutos antes de tentar novamente.')
        }
        throw error
      }

      if (data?.user) {
        alert('Por favor, verifique seu email para confirmar o cadastro.')
      }
    } catch (error) {
      console.error('Erro no signup:', error)
      setError(error instanceof Error ? error.message : 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  // Quando o captcha for verificado, fazer o signup
  const handleCaptchaVerify = (token: string | null) => {
    setCaptchaToken(token)
    if (token) {
      handleSignUp()
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {!showCaptcha ? (
        <form onSubmit={handleInitialSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome de usuário
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Registrar
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="mb-4 text-sm text-gray-600">
            Verificando segurança...
          </p>
          <div className="animate-pulse w-8 h-8 mx-auto">
            <svg className="w-full h-full text-purple-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
} 