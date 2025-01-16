'use client'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/utils/string'

interface ProfileFormProps {
  fullName: string
  username: string
  email: string
  avatarUrl?: string
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function ProfileForm({
  fullName,
  username,
  email,
  avatarUrl,
  onSubmit,
  onCancel
}: ProfileFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-4 mb-8">
        {avatarUrl ? (
          <Avatar className="w-20 h-20">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-2xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
              {getInitials(fullName)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg transform hover:scale-105 transition-all duration-200">
            {getInitials(fullName)}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Nome completo
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            defaultValue={fullName}
            className="mt-1 w-full p-2 border rounded-md"
          />
          <p className="mt-2 text-sm text-gray-600 italic">
            Adicione aqui como será visto o seu nome nos comentários e reviews
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome de usuário
          </label>
          <input
            type="text"
            value={username}
            disabled
            className="w-full p-2 border rounded-md bg-gray-50"
          />
          <p className="mt-1 text-sm text-gray-500">
            O nome de usuário não pode ser alterado
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full p-2 border rounded-md bg-gray-50"
          />
          <p className="mt-1 text-sm text-gray-500">
            O email não pode ser alterado por questões de segurança
          </p>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  )
} 