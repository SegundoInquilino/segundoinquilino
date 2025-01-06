'use client'

import { useState } from 'react'
import Link from 'next/link'
import Sidebar from './Sidebar'
import NotificationBell from './NotificationBell'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { currentUserId } = useAuth()
  const pathname = usePathname()

  // Verificar se estamos na página de autenticação
  const isAuthPage = pathname === '/auth'

  // Não mostrar o menu se estiver na página de auth ou não estiver logado
  const shouldShowMenu = currentUserId && !isAuthPage

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mostrar botão do menu apenas se estiver logado e não estiver na página de auth */}
            {shouldShowMenu && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
            
            <Link href="/" className="ml-4 flex items-center">
              <span className="text-xl font-bold text-gray-800">
                Segundo Inquilino
              </span>
            </Link>
          </div>

          {/* Mostrar notificações apenas se estiver logado */}
          {shouldShowMenu && (
            <div className="flex items-center">
              <NotificationBell />
            </div>
          )}
        </div>
      </div>

      {/* Renderizar Sidebar apenas se estiver logado */}
      {shouldShowMenu && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentUserId={currentUserId}
        />
      )}
    </nav>
  )
} 