'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase-client'
import NotificationBell from './NotificationBell'
import { 
  HomeIcon, 
  PlusCircleIcon, 
  UserCircleIcon, 
  BuildingOfficeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentUserId?: string
}

interface UserProfile {
  username: string
  email: string
}

export default function Sidebar({ isOpen, onClose, currentUserId }: SidebarProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const router = useRouter()
  const pathname = usePathname()
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

      const { data: { user } } = await supabase.auth.getUser()

      if (profile && user) {
        setUserProfile({
          username: profile.username,
          email: user.email || ''
        })
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      
      // Fechar o sidebar
      onClose()
      
      // Redirecionar e forçar refresh
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const isCurrentPath = (path: string) => {
    return pathname === path
  }

  return (
    <>
      {/* Overlay com blur */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar com tema roxo escuro */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-purple-900 shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Perfil do usuário */}
          {currentUserId && userProfile && (
            <div className="p-6 border-b border-purple-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-xl text-white font-medium">
                    {userProfile.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">
                    {userProfile.username}
                  </h3>
                  <p className="text-gray-300 text-sm truncate">
                    {userProfile.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Menu de navegação */}
          <div className="flex-1 p-6">
            <nav className="space-y-2">
              {currentUserId && (
                <>
                  <Link 
                    href="/home"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      isCurrentPath('/home')
                        ? 'bg-white text-purple-900 font-medium shadow-sm'
                        : 'text-gray-200 hover:bg-purple-800/50 hover:text-white'
                    }`}
                  >
                    <HomeIcon className="w-5 h-5" />
                    <span>Home</span>
                  </Link>

                  <Link 
                    href="/new-review"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      isCurrentPath('/new-review')
                        ? 'bg-white text-purple-900 font-medium shadow-sm'
                        : 'text-gray-200 hover:bg-purple-800/50 hover:text-white'
                    }`}
                  >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Nova Review</span>
                  </Link>

                  <Link 
                    href="/profile"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      isCurrentPath('/profile')
                        ? 'bg-white text-purple-900 font-medium shadow-sm'
                        : 'text-gray-200 hover:bg-purple-800/50 hover:text-white'
                    }`}
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    <span>Perfil</span>
                  </Link>

                  <Link 
                    href="/buildings"
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      isCurrentPath('/buildings')
                        ? 'bg-white text-purple-900 font-medium shadow-sm'
                        : 'text-gray-200 hover:bg-purple-800/50 hover:text-white'
                    }`}
                  >
                    <BuildingOfficeIcon className="w-5 h-5" />
                    <span>Apartamentos</span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:bg-purple-800/50 hover:text-white rounded-lg transition-all duration-200"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Log out</span>
                  </button>
                </>
              )}

              {!currentUserId && (
                <Link 
                  href="/auth"
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isCurrentPath('/auth')
                      ? 'bg-white text-purple-900 font-medium shadow-sm'
                      : 'text-gray-200 hover:bg-purple-800/50 hover:text-white'
                  }`}
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Entrar</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
} 