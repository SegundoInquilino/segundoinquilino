'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    // Verifica se o usuário já aceitou os cookies
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowConsent(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true')
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex-1 pr-4">
            <p className="text-sm text-gray-700">
              Utilizamos cookies para melhorar sua experiência no site. Ao continuar navegando, você concorda com a nossa{' '}
              <a href="/privacy" className="text-purple-600 hover:text-purple-800 underline">
                Política de Privacidade
              </a>.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={acceptCookies}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Aceitar
            </button>
            <button
              onClick={() => setShowConsent(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Fechar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 