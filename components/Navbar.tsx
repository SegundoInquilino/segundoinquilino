'use client'

import Link from 'next/link'
import NotificationBell from './NotificationBell'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase-client'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { currentUserId } = useAuth()
  const [username, setUsername] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    if (currentUserId) {
      loadUsername()
    }
  }, [currentUserId])

  const loadUsername = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', currentUserId)
        .single()

      if (profile) {
        setUsername(profile.username)
      }
    } catch (error) {
      console.error('Erro ao carregar username:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = '/auth'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link 
            href={currentUserId ? "/home" : "/"}
            className="flex items-center space-x-2"
          >
            <svg 
              className="w-8 h-8 text-primary-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
            <span className="text-xl font-bold text-primary-600">Segundo Inquilino</span>
          </Link>

          <div className="flex items-center space-x-4">
            {currentUserId ? (
              <>
                <Link
                  href="/new-review"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Nova Review
                </Link>
                <NotificationBell userId={currentUserId} />
                <Link href="/profile" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-medium">
                      {username?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-gray-700">{username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                className="text-primary-600 hover:text-primary-700"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 