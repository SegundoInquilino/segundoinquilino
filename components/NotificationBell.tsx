'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useRouter } from 'next/navigation'

interface Notification {
  id: string
  review_id: string
  comment_id?: string
  from_user_id: string
  read: boolean
  created_at: string
  reviews: {
    apartments: {
      address: string
    }[]
  }[]
  review_comments?: {
    comment: string
  }[]
  from_user: {
    username: string
  }[]
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const loadNotifications = async () => {
    try {
      console.log('Carregando notificações para:', userId)
      
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          review_id,
          comment_id,
          from_user_id,
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
          from_user (
            username
          )
        `)
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      console.log('Notificações carregadas:', data)
      setNotifications(
        data?.map(notification => ({
          id: notification.id,
          review_id: notification.review_id,
          comment_id: notification.comment_id,
          from_user_id: notification.from_user_id,
          read: notification.read,
          created_at: notification.created_at,
          reviews: {
            apartments: notification.reviews?.[0]?.apartments || []
          },
          review_comments: notification.review_comments,
          from_user: notification.from_user
        })) || []
      )
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    }
  }

  useEffect(() => {
    loadNotifications()

    // Inscrever para atualizações em tempo real
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
  }, [userId])

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Marcar como lida
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notification.id)

      // Atualizar estado local
      setNotifications(prev => prev.filter(n => n.id !== notification.id))

      // Redirecionar com parâmetros para abrir o modal
      router.push(`/reviews?reviewId=${notification.review_id}&commentId=${notification.comment_id}&showModal=true`)
      setShowDropdown(false)
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-800"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-900 p-2">
              Notificações
            </h3>
            <div className="divide-y divide-gray-100">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500 p-4 text-center">
                  Nenhuma notificação nova
                </p>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="w-full text-left p-3 hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900">
                      Novo comentário em {notification.reviews?.[0]?.apartments?.[0]?.address}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {notification.from_user[0].username} comentou: "
                      {notification.review_comments?.[0]?.comment.substring(0, 50) || ''}
                      {notification.review_comments?.[0]?.comment.length > 50 ? '...' : '"'}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 