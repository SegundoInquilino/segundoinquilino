'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { toast } from 'react-hot-toast'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/utils/string'

interface ProfileFormProps {
  profile: {
    id: string
    username?: string
    full_name?: string
    avatar_url?: string
  }
  onSubmit: (updates: any) => Promise<void>
  loading: boolean
}

export default function ProfileForm({ profile, onSubmit, loading }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await onSubmit({ full_name: fullName })
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error('Erro ao atualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-4 mb-8">
        {profile.avatar_url ? (
          <Avatar className="w-20 h-20">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-2xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
              {getInitials(profile.full_name || '')}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
            {getInitials(profile.full_name || '')}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{profile.full_name}</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Nome Completo
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            disabled={loading || saving}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome de usuário
          </label>
          <input
            type="text"
            value={profile.username}
            disabled
            className="w-full p-2 border rounded-md bg-gray-50"
          />
          <p className="mt-1 text-sm text-gray-500">
            O nome de usuário não pode ser alterado
          </p>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={loading || saving}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
} 