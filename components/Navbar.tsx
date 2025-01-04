'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NotificationBell from './NotificationBell'
import { createClient } from '@/utils/supabase-client'

export default function Navbar({ username, currentUserId }: { username?: string, currentUserId?: string }) {
  const router = useRouter()

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e nome */}
          <Link 
            href={currentUserId ? "/home" : "/"} 
            className="flex items-center space-x-3 text-primary-600 hover:text-primary-700"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xl font-bold">Segundo Inquilino</span>
          </Link>

          {/* Menu direito */}
          <div className="flex items-center space-x-6">
            {currentUserId && (
              <Link
                href="/new-review"
                className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Nova Review
              </Link>
            )}

            {currentUserId && (
              <NotificationBell userId={currentUserId} />
            )}

            {username ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white">
                    {username[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline font-medium">
                    {username}
                  </span>
                </Link>

                <button
                  onClick={async () => {
                    const supabase = createClient()
                    await supabase.auth.signOut()
                    router.push('/auth')
                  }}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="text-primary-600 hover:text-primary-700 font-medium"
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