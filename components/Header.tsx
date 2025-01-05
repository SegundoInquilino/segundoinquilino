'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import NotificationBell from './NotificationBell'
import Sidebar from './Sidebar'
import { createClient } from '@/utils/supabase-client'

interface HeaderProps {
  currentUserId?: string
}

export default function Header({ currentUserId }: HeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [username, setUsername] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (currentUserId) {
      loadUserProfile()
    }
  }, [currentUserId])

  const loadUserProfile = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', currentUserId)
        .single()

      if (profile?.username) {
        setUsername(profile.username)
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Menu Button */}
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

          {/* Logo/Brand */}
          <Link href="/home" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              Segundo Inquilino
            </span>
          </Link>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {currentUserId && (
              <>
                <NotificationBell userId={currentUserId} />
                <div className="flex items-center space-x-2">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  {/* Username */}
                  <span className="text-sm font-medium text-gray-700">
                    {username}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentUserId={currentUserId}
      />
    </header>
  )
} 