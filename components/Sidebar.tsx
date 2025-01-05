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
    await supabase.auth.signOut()
    router.push('/')
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
                >
                  Nova Review
                </Link>
                <Link 
                  href="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
                >
                  Perfil
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors"
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