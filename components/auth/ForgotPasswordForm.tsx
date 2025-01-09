'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ForgotPasswordFormProps {
  onBack: () => void
}

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log('Tentando enviar email para:', email)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      console.log('Resposta do Supabase:', { data, error })

      if (error) {
        setError(error.message)
        console.error('Erro ao enviar email:', error)
      } else {
        setSuccess(true)
        console.log('Email enviado com sucesso!')
      }
    } catch (err) {
      console.error('Erro inesperado:', err)
      setError('Erro ao enviar email de recuperação')
    }

    setLoading(false)
  }

  if (success) {
    return (
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email enviado!</h3>
        <p className="text-sm text-gray-600 mb-4">
          Verifique sua caixa de entrada para instruções de como redefinir sua senha.
        </p>
        <button
          onClick={onBack}
          className="text-primary-600 hover:text-primary-500 text-sm"
        >
          Voltar para o login
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h3 className="text-lg font-medium text-gray-900">Esqueceu sua senha?</h3>
        <p className="text-sm text-gray-600 mt-1">
          Digite seu email e enviaremos instruções para redefinir sua senha.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex flex-col space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar instruções'}
          </button>
          
          <button
            type="button"
            onClick={onBack}
            className="text-primary-600 hover:text-primary-500 text-sm"
          >
            Voltar para o login
          </button>
        </div>
      </form>
    </div>
  )
} 