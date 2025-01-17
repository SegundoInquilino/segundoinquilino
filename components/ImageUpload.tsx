'use client'

import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { createClient } from '@/utils/supabase-client'

type ImageUploadProps = {
  onUploadComplete: (urls: string[]) => void
  maxImages?: number
}

export default function ImageUpload({ onUploadComplete, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [error, setError] = useState<string>('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    try {
      setError('')
      setUploading(true)

      const supabase = createClient()
      const newUploadedUrls: string[] = [...uploadedUrls]
      const filesArray = Array.from(files)

      for (const file of filesArray) {
        // Validar tamanho (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('Cada imagem deve ter no máximo 5MB')
          return
        }

        // Validar tipo
        if (!file.type.startsWith('image/')) {
          setError('Apenas imagens são permitidas')
          return
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `apartment-images/${fileName}`

        // Criar preview
        const objectUrl = URL.createObjectURL(file)
        setPreviewUrls(prev => [...prev, objectUrl])

        // Upload para o Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from('reviews')
          .upload(filePath, file)

        console.log('Upload response:', { error: uploadError, data })

        if (uploadError) {
          console.error('Erro no upload:', uploadError)
          setError('Erro ao fazer upload da imagem')
          continue
        }

        // Pegar URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('reviews')
          .getPublicUrl(filePath)

        console.log('Public URL:', publicUrl)
        newUploadedUrls.push(publicUrl)
      }

      setUploadedUrls(newUploadedUrls)
      console.log('Todas URLs:', newUploadedUrls)
      onUploadComplete(newUploadedUrls)
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      setError('Erro ao fazer upload da imagem')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index)
    const newUploadedUrls = uploadedUrls.filter((_, i) => i !== index)
    setPreviewUrls(newPreviewUrls)
    setUploadedUrls(newUploadedUrls)
    onUploadComplete(newUploadedUrls)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Clique para enviar</span> ou arraste as imagens
            </p>
            <p className="text-xs text-gray-500">PNG, JPG ou GIF (Max. {maxImages} imagens)</p>
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {uploading && (
        <div className="text-center">
          <p className="text-gray-500">Enviando imagens...</p>
        </div>
      )}

      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previewUrls.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-24 w-full object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 