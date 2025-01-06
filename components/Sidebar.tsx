'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase-client'
import NotificationBell from './NotificationBell'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentUserId?: string
}

export default function Sidebar({ isOpen, onClose, currentUserId }: SidebarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    try {
      // Primeiro faz o logout
      await supabase.auth.signOut()
      
      // Fecha o sidebar
      onClose()
      
      // Força uma navegação completa para a landing page
      window.location.href = '/'
      
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleNavigation = (path: string) => {
    onClose() // Fecha o menu
    router.push(path) // Navega para a página
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <svg 
                className="w-6 h-6 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>

          <nav className="space-y-4">
            <Link 
              href="/home"
              className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
            >
              Início
            </Link>
            <Link 
              href="/reviews"
              className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
            >
              Reviews
            </Link>
            {currentUserId && (
              <>
                <Link 
                  href="/new-review"
                  className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                  onClick={() => handleNavigation('/new-review')}
                >
                  Nova Review
                </Link>
                <Link 
                  href="/favorites"
                  className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                  onClick={() => handleNavigation('/favorites')}
                >
                  <div className="flex items-center space-x-2">
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>Favoritos</span>
                  </div>
                </Link>
                <Link 
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                  onClick={() => handleNavigation('/profile')}
                >
                  Perfil
                </Link>
                <button 
                  onClick={() => handleNavigation('/settings')}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Configurações</span>
                  </div>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Sair
                </button>
              </>
            )}
            {!currentUserId && (
              <Link 
                href="/auth"
                className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
              >
                Entrar
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  )
} 