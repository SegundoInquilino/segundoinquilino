'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  review_id: string
  comment_id: string
  read: boolean
  created_at: string
  reviews: {
    apartments: {
      address: string
    }
  }
  profiles: {
    username: string
  }
  review_comments: {
    comment: string
  }[]
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (userId) {
      loadNotifications()
      subscribeToNotifications()
    }
  }, [userId])

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          review_id,
          comment_id,
          read,
          created_at,
          reviews (
            apartments (
              address
            )
          ),
          review_comments (
            comment
          ),
          profiles!from_user_id (
            username
          )
        `)
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToNotifications = () => {
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Nova notificação:', payload)
          loadNotifications()
        }
      )
      .subscribe((status) => {
        console.log('Status do canal de notificações:', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Marcar como lida se ainda não estiver
      if (!notification.read) {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', notification.id)

        // Atualizar estado local
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id 
              ? { ...n, read: true }
              : n
          )
        )
      }

      // Redirecionar para a review e forçar refresh da página
      router.push(`/reviews?reviewId=${notification.review_id}&showModal=true&commentId=${notification.comment_id}&t=${Date.now()}`)
    } catch (error) {
      console.error('Erro ao processar notificação:', error)
    }
  }

  const deleteNotification = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation()
    try {
      // Em vez de deletar, vamos marcar como deletada
      const { error } = await supabase
        .from('notifications')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', notificationId)

      if (error) throw error

      // Atualizar estado local
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    } catch (error) {
      console.error('Erro ao deletar notificação:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <button 
        className="relative p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  flex items-start space-x-4 p-3 rounded-lg cursor-pointer relative group
                  ${notification.read 
                    ? 'bg-gray-50 hover:bg-gray-100' 
                    : 'bg-blue-50 hover:bg-blue-100'
                  }
                  transition-colors duration-200
                `}
                onClick={() => {
                  handleNotificationClick(notification)
                  setIsOpen(false)
                }}
              >
                {/* Indicador de não lida */}
                {!notification.read && (
                  <div className="absolute left-1 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
                
                <div className="flex-1 pl-4">
                  <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                    <span className="font-medium">
                      {notification.profiles?.username}
                    </span>{' '}
                    comentou em sua review do endereço{' '}
                    <span className="font-medium">
                      {notification.reviews?.apartments?.address}
                    </span>
                  </p>
                  <p className={`text-xs mt-1 ${notification.read ? 'text-gray-400' : 'text-gray-500'}`}>
                    {notification.review_comments?.[0]?.comment}
                  </p>
                </div>

                {/* Botão de deletar */}
                <button
                  onClick={(e) => deleteNotification(e, notification.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded-full"
                  title="Remover notificação"
                >
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 