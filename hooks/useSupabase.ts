import { createClient } from '@/utils/supabase-client'
import { useEffect, useState } from 'react'

let supabaseInstance: ReturnType<typeof createClient> | null = null

export function useSupabase() {
  const [client] = useState(() => {
    if (!supabaseInstance) {
      supabaseInstance = createClient()
    }
    return supabaseInstance
  })

  useEffect(() => {
    return () => {
      // Cleanup se necessário
    }
  }, [])

  return client
} 