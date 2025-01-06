'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useRouter } from 'next/navigation'
import ToggleSwitch from '@/components/ToggleSwitch'

interface UserSettings {
  // Notificações
  email_notifications: boolean
  notify_on_replies: boolean
  notify_on_likes: boolean

  // Visualização
  default_view: 'grid' | 'list'
  reviews_per_page: 10 | 20 | 50
  sort_by: 'recent' | 'rating' | 'likes'

  // Privacidade
  show_profile: boolean
  show_reviews: boolean

  // Preferências
  default_city: string
  property_types: ('house' | 'apartment')[]
  language: 'pt' | 'en'
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettings>({
    email_notifications: true,
    notify_on_replies: true,
    notify_on_likes: true,
    default_view: 'grid',
    reviews_per_page: 20,
    sort_by: 'recent',
    show_profile: true,
    show_reviews: true,
    default_city: '',
    property_types: ['house', 'apartment'],
    language: 'pt'
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }

      const { data: userSettings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (userSettings) {
        setSettings(userSettings)
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: keyof UserSettings, value: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          [key]: value,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setSettings(prev => ({ ...prev, [key]: value }))
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-6">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Configurações</h1>

        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {/* Seção de Notificações */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Notificações</h2>
            
            {/* Email */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Email</h3>
                  <p className="text-sm text-gray-500">Receba atualizações por email</p>
                </div>
                <ToggleSwitch
                  enabled={settings.email_notifications}
                  onChange={(value) => updateSetting('email_notifications', value)}
                />
              </div>

              {/* Notificações de Respostas */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Respostas</h3>
                  <p className="text-sm text-gray-500">Notificar quando alguém responder</p>
                </div>
                <ToggleSwitch
                  enabled={settings.notify_on_replies}
                  onChange={(value) => updateSetting('notify_on_replies', value)}
                />
              </div>

              {/* Notificações de Likes */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Curtidas</h3>
                  <p className="text-sm text-gray-500">Notificar quando alguém curtir</p>
                </div>
                <ToggleSwitch
                  enabled={settings.notify_on_likes}
                  onChange={(value) => updateSetting('notify_on_likes', value)}
                />
              </div>
            </div>
          </div>

          {/* Seção de Visualização */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Visualização</h2>
            
            {/* Visualização Padrão */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium text-gray-900">Layout Padrão</h3>
                <select
                  value={settings.default_view}
                  onChange={(e) => updateSetting('default_view', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                >
                  <option value="grid">Grade</option>
                  <option value="list">Lista</option>
                </select>
              </div>

              {/* Reviews por Página */}
              <div>
                <h3 className="text-base font-medium text-gray-900">Reviews por Página</h3>
                <select
                  value={settings.reviews_per_page}
                  onChange={(e) => updateSetting('reviews_per_page', Number(e.target.value))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Ordenação Padrão */}
              <div>
                <h3 className="text-base font-medium text-gray-900">Ordenação Padrão</h3>
                <select
                  value={settings.sort_by}
                  onChange={(e) => updateSetting('sort_by', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                >
                  <option value="recent">Mais Recentes</option>
                  <option value="rating">Melhor Avaliados</option>
                  <option value="likes">Mais Curtidos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seção de Privacidade */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Privacidade</h2>
            
            <div className="space-y-4">
              {/* Mostrar Perfil */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Perfil Público</h3>
                  <p className="text-sm text-gray-500">Permitir que outros vejam seu perfil</p>
                </div>
                <ToggleSwitch
                  enabled={settings.show_profile}
                  onChange={(value) => updateSetting('show_profile', value)}
                />
              </div>

              {/* Mostrar Reviews */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Reviews Públicas</h3>
                  <p className="text-sm text-gray-500">Permitir que outros vejam suas reviews</p>
                </div>
                <ToggleSwitch
                  enabled={settings.show_reviews}
                  onChange={(value) => updateSetting('show_reviews', value)}
                />
              </div>
            </div>
          </div>

          {/* Seção de Preferências */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Preferências</h2>
            
            <div className="space-y-4">
              {/* Cidade Padrão */}
              <div>
                <h3 className="text-base font-medium text-gray-900">Cidade Padrão</h3>
                <input
                  type="text"
                  value={settings.default_city}
                  onChange={(e) => updateSetting('default_city', e.target.value)}
                  placeholder="Digite sua cidade"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                />
              </div>

              {/* Tipos de Imóveis */}
              <div>
                <h3 className="text-base font-medium text-gray-900">Tipos de Imóveis</h3>
                <div className="mt-2 space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.property_types.includes('house')}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...settings.property_types, 'house']
                          : settings.property_types.filter(t => t !== 'house')
                        updateSetting('property_types', newTypes)
                      }}
                      className="form-checkbox h-4 w-4 text-purple-600"
                    />
                    <span className="ml-2">Casa</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.property_types.includes('apartment')}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...settings.property_types, 'apartment']
                          : settings.property_types.filter(t => t !== 'apartment')
                        updateSetting('property_types', newTypes)
                      }}
                      className="form-checkbox h-4 w-4 text-purple-600"
                    />
                    <span className="ml-2">Apartamento</span>
                  </label>
                </div>
              </div>

              {/* Idioma */}
              <div>
                <h3 className="text-base font-medium text-gray-900">Idioma</h3>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting('language', e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                >
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 