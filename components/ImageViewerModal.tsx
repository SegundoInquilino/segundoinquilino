'use client'

import { Dialog } from '@headlessui/react'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface ImageViewerModalProps {
  images: string[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export default function ImageViewerModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious
}: ImageViewerModalProps) {
  return (
    <div className={`fixed inset-0 z-[70] ${isOpen ? '' : 'hidden'}`}>
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Fechar visualização"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onPrevious()
                }}
                className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Imagem anterior"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onNext()
                }}
                className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Próxima imagem"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="relative w-full h-full p-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[currentIndex]}
              alt={`Foto ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </div>
    </div>
  )
} 