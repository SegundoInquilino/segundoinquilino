'use client'

import { useState, useRef, TouchEvent } from 'react'
import Image from 'next/image'

interface ImageCarouselProps {
  images: string[]
  alt: string
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef<number>(0)

  if (!images || images.length === 0) return null

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX.current - touchEndX

    // Determina a direção do swipe
    if (Math.abs(diff) > 50) { // Mínimo de 50px para considerar como swipe
      if (diff > 0 && currentIndex < images.length - 1) {
        // Swipe para esquerda
        setCurrentIndex(prev => prev + 1)
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe para direita
        setCurrentIndex(prev => prev - 1)
      }
    }
  }

  return (
    <div className="relative w-full h-48 mb-4 group">
      <div
        className="relative w-full h-full overflow-hidden rounded-lg"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[currentIndex]}
          alt={`${alt} - Imagem ${currentIndex + 1}`}
          fill
          className="object-cover"
        />
        
        {/* Indicadores de imagem */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-white w-4' 
                    : 'bg-white/50'
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Botões de navegação */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex(prev => Math.max(prev - 1, 0))}
              className={`absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity ${
                currentIndex === 0 ? 'hidden' : ''
              }`}
              aria-label="Imagem anterior"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentIndex(prev => Math.min(prev + 1, images.length - 1))}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black/30 text-white opacity-0 group-hover:opacity-100 transition-opacity ${
                currentIndex === images.length - 1 ? 'hidden' : ''
              }`}
              aria-label="Próxima imagem"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
} 