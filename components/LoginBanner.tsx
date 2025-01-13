'use client'

import Link from 'next/link'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface LoginBannerProps {
  show: boolean
}

export default function LoginBanner({ show }: LoginBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (!show || isDismissed) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-black text-white py-2 px-4 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm">
            Faça login para aproveitar todas as funcionalidades
          </p>
          <Link
            href="/auth"
            className="text-sm bg-white text-black px-4 py-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            Entrar
          </Link>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-white/70 hover:text-white"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
} 