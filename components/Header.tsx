'use client'

import { useState } from 'react'
import Link from 'next/link'
import NotificationBell from './NotificationBell'
import Sidebar from './Sidebar'
import Image from 'next/image'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/utils/string'
import { MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline'

interface HeaderProps {
  currentUserId?: string
  username?: string
  profile?: {
    avatar_url?: string
    full_name?: string
  }
}

export default function Header({ username, currentUserId, profile }: HeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Menu e Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            <Link 
              href={currentUserId ? '/dashboard' : '/'} 
              className="flex items-center gap-2"
            >
              <Image
                src="/images/Logo_SI_icon.png"
                alt="Segundo Inquilino"
                width={32}
                height={32}
                className="h-8 w-auto"
                priority
              />
              <span className="hidden md:block font-semibold text-gray-900">
                SegundoInquilino
              </span>
            </Link>
          </div>

          {/* Busca e Ações */}
          <div className="flex items-center gap-4">
            <Link 
              href="/reviews"
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
              title="Buscar reviews"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </Link>

            {currentUserId ? (
              <div className="flex items-center gap-4">
                <NotificationBell userId={currentUserId} />
                
                <Link
                  href="/profile"
                  className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8 ring-2 ring-white">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-medium">
                        {getInitials(profile?.full_name || username || 'Usuário')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {username}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                href="/auth"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm hover:shadow"
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