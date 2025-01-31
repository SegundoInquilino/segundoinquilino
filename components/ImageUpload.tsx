'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/utils/supabase-client'
import { StorageError } from '@supabase/storage-js'

interface ImageUploadProps {
  images?: File[]
  onChange?: (files: File[]) => void
  onUploadComplete?: (urls: string[]) => void
  maxFiles?: number
}

export default function ImageUpload({ 
  images = [], 
  onChange, 
  onUploadComplete,
  maxFiles = 5
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [localFiles, setLocalFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const supabase = createClient()

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('reviews_images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Upload error:', uploadError.message)
        throw uploadError
      }

      const { data } = supabase.storage
        .from('reviews_images')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Erro no upload:', error instanceof StorageError ? error.message : error)
      return null
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    try {
      // Limitar o número de arquivos
      const newFiles = [...localFiles, ...acceptedFiles].slice(0, maxFiles)
      setLocalFiles(newFiles)
      onChange?.(newFiles)

      // Criar previews
      const newPreviews = newFiles.map(file => URL.createObjectURL(file))
      setPreviews(prev => {
        // Limpar URLs antigas
        prev.forEach(url => URL.revokeObjectURL(url))
        return newPreviews
      })

      // Upload das imagens
      const uploadPromises = newFiles.map(uploadImage)
      const urls = await Promise.all(uploadPromises)
      const validUrls = urls.filter((url): url is string => url !== null)

      onUploadComplete?.(validUrls)
    } catch (error) {
      console.error('Erro no upload:', error)
    } finally {
      setUploading(false)
    }
  }, [localFiles, onChange, onUploadComplete, maxFiles])

  const removeImage = (index: number) => {
    const newFiles = [...localFiles]
    newFiles.splice(index, 1)
    setLocalFiles(newFiles)
    onChange?.(newFiles)

    const newPreviews = [...previews]
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: maxFiles - localFiles.length,
    disabled: localFiles.length >= maxFiles || uploading
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400'}
          ${localFiles.length >= maxFiles || uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p className="text-purple-600">Fazendo upload...</p>
        ) : isDragActive ? (
          <p className="text-purple-600">Solte as imagens aqui...</p>
        ) : (
          <p className="text-gray-500">
            {localFiles.length >= maxFiles 
              ? `Limite de ${maxFiles} imagens atingido`
              : `Arraste imagens ou clique para selecionar (${localFiles.length}/${maxFiles})`
            }
          </p>
        )}
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 