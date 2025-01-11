'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import NotificationBell from './NotificationBell'
import Sidebar from './Sidebar'
import Image from 'next/image'

interface HeaderProps {
  currentUserId?: string
  username?: string
  profile?: {
    avatar_url?: string
  }
}

export default function Header({ username, currentUserId, profile }: HeaderProps) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url)

  useEffect(() => {
    // Verifica se tem uma sessão ativa
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
      }
    }

    checkSession()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
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
          <div className="flex items-center">
            <Image
              src="/images/Logo_SI_icon.png"
              alt="Segundo Inquilino"
              width={32}
              height={32}
              className="h-auto w-auto"
              priority
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {currentUserId ? (
              <>
                <NotificationBell userId={currentUserId} />
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium flex items-center gap-2 group"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium group-hover:bg-purple-700 transition-colors">
                      {username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <span className="hover:underline">{username}</span>
                </Link>
              </>
            ) : (
              <Link
                href="/auth"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Entrar
              </Link>
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