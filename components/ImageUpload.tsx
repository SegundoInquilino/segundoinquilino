'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/utils/supabase-client'
import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ImageUploadProps {
  onImagesUploaded: (urls: string[]) => void
  maxImages?: number
  existingImages?: string[]
}

export default function ImageUpload({ onImagesUploaded, maxImages = 5, existingImages = [] }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingImages)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (uploadedImages.length + acceptedFiles.length > maxImages) {
      alert(`Você pode enviar no máximo ${maxImages} imagens`)
      return
    }

    setIsUploading(true)
    const supabase = createClient()

    try {
      const newImages = await Promise.all(
        acceptedFiles.map(async (file) => {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `${fileName}`

          const { error: uploadError, data } = await supabase.storage
            .from('visit-reviews')
            .upload(filePath, file)

          if (uploadError) {
            throw uploadError
          }

          const { data: { publicUrl } } = supabase.storage
            .from('visit-reviews')
            .getPublicUrl(filePath)

          return publicUrl
        })
      )

      const updatedImages = [...uploadedImages, ...newImages]
      setUploadedImages(updatedImages)
      onImagesUploaded(updatedImages)
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
      alert('Erro ao fazer upload das imagens')
    } finally {
      setIsUploading(false)
    }
  }, [maxImages, onImagesUploaded, uploadedImages])

  const handleRemoveImage = async (imageUrl: string) => {
    if (!confirm('Tem certeza que deseja remover esta imagem?')) return

    try {
      const supabase = createClient()
      const fileName = imageUrl.split('/').pop()
      
      if (fileName) {
        // Remove do storage apenas se a imagem estiver no storage (não for uma URL externa)
        if (imageUrl.includes('visit-reviews')) {
          const { error } = await supabase.storage
            .from('visit-reviews')
            .remove([fileName])

          if (error) throw error
        }
      }

      const updatedImages = uploadedImages.filter(url => url !== imageUrl)
      setUploadedImages(updatedImages)
      onImagesUploaded(updatedImages)
    } catch (error) {
      console.error('Erro ao remover imagem:', error)
      alert('Erro ao remover imagem')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    disabled: isUploading || uploadedImages.length >= maxImages
  })

  return (
    <div className="space-y-4">
      {/* Preview das imagens */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {uploadedImages.map((url, index) => (
            <div key={url} className="relative aspect-video">
              <Image
                src={url}
                alt={`Imagem ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemoveImage(url)}
                className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-gray-600 hover:text-red-500 transition-colors"
                title="Remover imagem"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone */}
      {uploadedImages.length < maxImages && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-500'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <p className="text-sm text-gray-500">Enviando...</p>
          ) : isDragActive ? (
            <p className="text-sm text-gray-500">Solte as imagens aqui...</p>
          ) : (
            <p className="text-sm text-gray-500">
              Arraste e solte imagens aqui, ou clique para selecionar
              <br />
              <span className="text-xs">
                ({uploadedImages.length}/{maxImages} imagens)
              </span>
            </p>
          )}
        </div>
      )}
    </div>
  )
} 