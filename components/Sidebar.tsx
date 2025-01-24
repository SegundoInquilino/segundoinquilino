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
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  BellIcon,
  Squares2X2Icon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon
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

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Squares2X2Icon,
      requiresAuth: true
    },
    {
      name: 'Home',
      href: '/home',
      icon: HomeIcon
    },
    {
      name: 'Nova Review',
      href: '/new-review',
      icon: PlusCircleIcon,
      requiresAuth: true
    },
    {
      name: 'Perfil',
      href: '/profile',
      icon: UserCircleIcon,
      requiresAuth: true
    },
    {
      name: 'Solicitar Reviews',
      href: '/review-requests',
      icon: BellIcon,
      requiresAuth: true
    },
    {
      name: 'Blog',
      href: '/blog',
      icon: DocumentTextIcon,
      requiresAuth: false
    },
    {
      name: 'Fórum',
      href: '/forum',
      icon: ChatBubbleLeftRightIcon,
      requiresAuth: false
    }
  ]

  return (
    <>
      {/* Overlay clicável */}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-black transform transition-transform z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Perfil do usuário */}
          {currentUserId && userProfile && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xl text-gray-700 font-medium">
                    {userProfile.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-gray-700 font-medium truncate">
                    {userProfile.username}
                  </h3>
                  <p className="text-gray-500 text-sm truncate">
                    {userProfile.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Menu de navegação */}
          <div className="flex-1 p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                (!item.requiresAuth || currentUserId) && (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      isCurrentPath(item.href)
                        ? 'bg-white text-black font-medium shadow-sm'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={onClose}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              ))}

              {/* Remover o link duplicado do Fórum */}
              
              {currentUserId && (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span>Log out</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
} 