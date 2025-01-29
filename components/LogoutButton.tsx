'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase-browser'
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = () => {
    supabase.auth.signOut()
      .then(() => {
        router.push('/')
        router.refresh()
      })
      .catch((error) => {
        console.error('Erro ao fazer logout:', error)
      })
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
    >
      <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
      Log Out
    </button>
  )
} 