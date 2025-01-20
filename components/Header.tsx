'use client'

import { useState } from 'react'
import Link from 'next/link'
import NotificationBell from './NotificationBell'
import Sidebar from './Sidebar'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/utils/string'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { FaRegEnvelope } from 'react-icons/fa'

interface HeaderProps {
  currentUserId?: string
  username?: string
  profile?: {
    avatar_url?: string
    full_name?: string
  }
}

export default function Header({ username, currentUserId, profile }: HeaderProps) {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Menu Button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-white bg-black hover:bg-gray-800 rounded-full transition-colors focus:outline-none"
          >
            <svg
              className="h-5 w-5"
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

          {/* Logo/Brand com link para dashboard quando logado */}
          <div className="flex items-center">
            <Link href={currentUserId ? '/dashboard' : '/'}>
              <Image
                src="/images/Logo_SI_icon.png"
                alt="Segundo Inquilino"
                width={32}
                height={32}
                className="h-auto w-auto"
                priority
              />
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/reviews"
              className="p-2 text-gray-600 hover:text-gray-900 rounded-full transition-colors"
              title="Buscar reviews"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
            </Link>

            {currentUserId ? (
              <>
                <NotificationBell userId={currentUserId} />
                <Link
                  href="/my-reviews"
                  className="text-gray-600 hover:text-gray-900"
                  title="Minhas Reviews"
                >
                  <FaRegEnvelope className="h-5 w-5" />
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium flex items-center gap-2 group"
                >
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback className="bg-black text-white font-bold">
                        {getInitials(profile?.full_name || username || 'Usuário')}
                      </AvatarFallback>
                    </Avatar>
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