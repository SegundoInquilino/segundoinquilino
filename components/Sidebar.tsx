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
      onClose()
      router.push('/auth')
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
      name: 'Reviews de Visitas',
      href: '/visit-reviews',
      icon: HomeIcon,
      requiresAuth: true
    },
    {
      name: 'Perfil',
      href: '/profile',
      icon: UserCircleIcon,
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
    },
  ]

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-primary-600">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Informações do Usuário */}
        {currentUserId && userProfile && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {userProfile.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userProfile.username}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {userProfile.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Links */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            (!item.requiresAuth || currentUserId) && (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                onClick={onClose}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          ))}
        </nav>

        {/* Botão de Logout */}
        {currentUserId && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center w-full px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
              Sair
            </button>
          </div>
        )}
      </div>
    </>
  )
} 