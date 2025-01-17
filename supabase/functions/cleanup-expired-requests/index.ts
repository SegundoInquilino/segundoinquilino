import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Função que será executada diariamente
export const cleanupExpiredRequests = async () => {
  const { error } = await supabase
    .from('review_requests')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .eq('status', 'pending') // Deleta apenas solicitações pendentes

  if (error) {
    console.error('Erro ao limpar solicitações expiradas:', error)
    throw error
  }
} 