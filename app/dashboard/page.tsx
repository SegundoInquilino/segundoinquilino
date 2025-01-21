'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase-client'
import { 
  MagnifyingGlassIcon, 
  PlusCircleIcon, 
  PencilIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  BellIcon,
  EnvelopeIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/utils/string'

export default function DashboardPage() {
  const { currentUserId } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<{
    username?: string
    full_name?: string
    email?: string
    avatar_url?: string
  } | null>(null)

  useEffect(() => {
    const loadUserProfile = async () => {
      const supabase = createClient()
      
      try {
        // Buscar dados do perfil
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url')
          .eq('id', currentUserId)
          .single()

        // Buscar email do usuário
        const { data: { user } } = await supabase.auth.getUser()

        setUserProfile({
          ...profile,
          email: user?.email
        })
      } catch (error) {
        console.error('Erro ao carregar perfil:', error)
      }
    }

    if (currentUserId) {
      loadUserProfile()
    }
  }, [currentUserId])

  useEffect(() => {
    // Dar tempo para o contexto de auth inicializar
    const timer = setTimeout(() => {
      if (!currentUserId) {
        router.push('/auth')
      }
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [currentUserId, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          Carregando...
        </div>
      </div>
    )
  }

  const shortcuts = [
    {
      title: 'Buscar Reviews',
      description: 'Encontre avaliações de imóveis',
      href: '/reviews',
      icon: <MagnifyingGlassIcon className="h-6 w-6" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Nova Review',
      description: 'Compartilhe sua experiência',
      href: '/new-review',
      icon: <PlusCircleIcon className="h-6 w-6" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Solicitar Review',
      description: 'Peça uma avaliação',
      href: '/review-requests',
      icon: <PencilIcon className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Minhas Reviews',
      description: 'Veja suas reviews solicitadas',
      href: '/my-reviews',
      icon: <EnvelopeIcon className="h-6 w-6" />,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      title: 'Sobre',
      description: 'Conheça o Segundo Inquilino',
      href: '/about',
      icon: <QuestionMarkCircleIcon className="h-6 w-6" />,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      title: 'Termos e Condições',
      description: 'Leia nossos termos',
      href: '/terms',
      icon: <DocumentTextIcon className="h-6 w-6" />,
      color: 'bg-gray-100 text-gray-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={userProfile?.avatar_url || ''} />
                <AvatarFallback className="bg-black text-white text-xl font-bold">
                  {getInitials(userProfile?.full_name || userProfile?.username || 'Usuário')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {userProfile?.full_name || userProfile?.username || 'Bem-vindo'}
                  </h2>
                  <Link 
                    href="/profile" 
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                    title="Editar perfil"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>
                </div>
                <p className="text-gray-500">{userProfile?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mb-6">
          Atalhos Rápidos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shortcuts.map((shortcut) => (
            <Link
              key={shortcut.href}
              href={shortcut.href}
              className="block group"
            >
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className={`inline-flex p-3 rounded-lg ${shortcut.color} mb-4`}>
                  {shortcut.icon}
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                  {shortcut.title}
                </h2>
                
                <p className="text-gray-600">
                  {shortcut.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Estatísticas ou informações adicionais podem ser adicionadas aqui */}
      </div>
    </div>
  )
} 