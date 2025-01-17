'use client'

import { useRouter } from 'next/navigation'

export default function LoginModal() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/auth')}
      className="w-full px-4 py-2 text-white bg-black rounded-lg hover:bg-gray-800 transition-colors"
    >
      Fazer login
    </button>
  )
} 