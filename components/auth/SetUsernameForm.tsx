'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface SetUsernameFormProps {
  user: any
  onComplete: () => void
}

export default function SetUsernameForm({ user, onComplete }: SetUsernameFormProps) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Verificar se username já existe
      const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single()

      if (existing) {
        setError('Este nome de usuário já está em uso')
        return
      }

      // Criar perfil com username
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username,
          email: user.email,
          updated_at: new Date().toISOString()
        })

      if (updateError) throw updateError

      onComplete()
    } catch (err) {
      console.error('Erro ao definir username:', err)
      setError('Erro ao salvar nome de usuário')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Escolha seu nome de usuário
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Nome de usuário
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Continuar'}
        </button>
      </form>
    </div>
  )
} 