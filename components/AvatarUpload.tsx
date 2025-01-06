'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@/utils/supabase-client-component'
import { v4 as uuidv4 } from 'uuid'

interface AvatarUploadProps {
  userId: string
  currentAvatarUrl?: string
  onUploadComplete: (url: string) => void
}

export default function AvatarUpload({ userId, currentAvatarUrl, onUploadComplete }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClientComponentClient()

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você precisa selecionar uma imagem para fazer upload')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/${uuidv4()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload da imagem
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Deletar avatar antigo se existir
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/').pop()
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${userId}/${oldPath}`])
        }
      }

      // Pegar URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Atualizar perfil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (updateError) throw updateError

      onUploadComplete(publicUrl)
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
          {currentAvatarUrl ? (
            <img
              src={currentAvatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl font-medium text-gray-400">
              ?
            </div>
          )}
        </div>
        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition-opacity">
          <span className="text-sm font-medium">Alterar foto</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>
      {uploading && (
        <div className="text-sm text-gray-500">Fazendo upload...</div>
      )}
    </div>
  )
} 