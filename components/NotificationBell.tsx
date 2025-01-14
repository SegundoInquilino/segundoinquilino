'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/utils/supabase-client'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Notification {
  id: string
  user_id: string
  review_id: string
  comment_id?: string
  read: boolean
  created_at: string
  reviews: {
    id: string
    apartments: {
      address: string
      building_name: string
    }[]
  }[]
  review_comments: {
    id: string
    comment: string
    created_at: string
    profiles: {
      username: string
      full_name?: string
      avatar_url?: string
    }[]
  }[]
}

interface NotificationBellProps {
  userId: string
}

export default function NotificationBell({ userId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (userId) {
      loadNotifications()
      subscribeToNotifications()
    }
  }, [userId])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          user_id,
          review_id,
          comment_id,
          read,
          created_at,
          reviews!inner (
            id,
            apartments!inner (
              address,
              building_name
            )
          ),
          review_comments (
            id,
            comment,
            created_at,
            profiles:user_id (
              username,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Erro na query do Supabase:', error.message)
        setNotifications([])
        return
      }

      if (!data || data.length === 0) {
        setNotifications([])
        return
      }

      const formattedData = data.map(notification => ({
        id: notification.id,
        user_id: notification.user_id,
        review_id: notification.review_id,
        comment_id: notification.comment_id,
        read: notification.read,
        created_at: notification.created_at,
        reviews: [{
          id: notification.reviews?.[0]?.id || '',
          apartments: [
            {
              address: notification.reviews?.[0]?.apartments?.[0]?.address || '',
              building_name: notification.reviews?.[0]?.apartments?.[0]?.building_name || ''
            }
          ]
        }],
        review_comments: Array.isArray(notification.review_comments) 
          ? notification.review_comments.map(comment => ({
              id: comment?.id || '',
              comment: comment?.comment || '',
              created_at: comment?.created_at || '',
              profiles: Array.isArray(comment?.profiles) ? comment.profiles : []
            }))
          : []
      }))

      setNotifications(formattedData)

    } catch (error) {
      console.error('Erro ao carregar notificações:', {
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      })
      setNotifications([])
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
      if (!notification.read) {
        await supabase
          .from('notifications')
          .update({ read: true })
          .eq('id', notification.id)
      }

      // Fechar o menu de notificações
      setIsOpen(false)
      
      // Usar window.location para forçar um refresh completo
      window.location.href = `/reviews?reviewId=${notification.review_id}&showModal=true&commentId=${notification.comment_id}`

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

  const clearAllNotifications = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ deleted_at: new Date().toISOString() })
        .eq('user_id', userId)

      if (error) throw error
      setNotifications([])
    } catch (error) {
      console.error('Erro ao limpar notificações:', error)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button 
        className="relative p-2.5 hover:bg-gray-100 rounded-full transition-all duration-200"
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
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2">
          <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-100 mt-16 sm:mt-0">
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                Notificações {notifications.length > 0 && `(${notifications.length})`}
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Limpar todas
                </button>
              )}
            </div>

            {notifications.length > 0 ? (
              <div className="max-h-[70vh] sm:max-h-[500px] overflow-y-auto">
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`
                        relative px-6 py-5 hover:bg-gray-50 cursor-pointer group
                        ${notification.read ? 'bg-white' : 'bg-blue-50/60'}
                        transition-colors duration-200
                      `}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 flex-shrink-0">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-900">
                              Há um comentário novo no seu review
                            </p>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-4">
                              {formatDistanceToNow(new Date(notification.created_at), {
                                addSuffix: true,
                                locale: ptBR
                              })}
                            </span>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3 mt-2">
                            <p className="text-xs text-gray-600 line-clamp-3">
                              {notification.review_comments?.[0]?.comment}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(e, notification.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-full transition-all duration-200"
                          title="Remover notificação"
                        >
                          <svg
                            className="w-4 h-4 text-gray-400 hover:text-gray-600"
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
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">Nenhuma notificação no momento</p>
              </div>
            )}

            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 