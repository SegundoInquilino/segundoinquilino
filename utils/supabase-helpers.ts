import { createClient } from '@/utils/supabase-client'

const MAX_RETRIES = 3
const INITIAL_DELAY = 1000 // 1 segundo

// Adicione a interface para o perfil
interface Profile {
  id: string
  username: string
}

export async function fetchWithRetry(operation: () => Promise<any>, retries = MAX_RETRIES) {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, INITIAL_DELAY * (MAX_RETRIES - retries + 1)))
      return fetchWithRetry(operation, retries - 1)
    }
    throw error
  }
}

export const supabaseClient = {
  async fetchComments(reviewId: string) {
    const supabase = createClient()
    return fetchWithRetry(async () => {
      // Buscar comentários
      const { data: comments, error } = await supabase
        .from('review_comments')
        .select('*')
        .eq('review_id', reviewId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erro ao buscar comentários:', error)
        throw error
      }

      console.log('Comentários brutos:', comments) // Debug

      // Buscar usernames
      if (comments && comments.length > 0) {
        const userIds = [...new Set(comments.map(c => c.user_id))]
        console.log('IDs de usuários únicos:', userIds) // Debug

        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds)

        if (profilesError) {
          console.error('Erro ao buscar perfis:', profilesError)
          throw profilesError
        }

        console.log('Perfis encontrados:', profiles) // Debug

        // Criar mapa de usernames
        const userMap: Record<string, string> = {}
        
        profiles?.forEach((profile: Profile) => {
          userMap[profile.id] = profile.username
        })

        console.log('Mapa de usernames:', userMap) // Debug

        // Adicionar usernames aos comentários
        const commentsWithUsernames = comments.map(comment => {
          const username = userMap[comment.user_id]
          console.log(`Mapeando username para comentário ${comment.id}:`, {
            user_id: comment.user_id,
            username
          }) // Debug
          return {
            ...comment,
            profiles: {
              username: username || 'Usuário'
            }
          }
        })

        // Organizar em árvore
        const commentMap = new Map()
        const rootComments: any[] = []

        commentsWithUsernames.forEach(comment => {
          commentMap.set(comment.id, { ...comment, replies: [] })
        })

        commentsWithUsernames.forEach(comment => {
          if (comment.parent_id) {
            const parent = commentMap.get(comment.parent_id)
            if (parent) {
              parent.replies.push(commentMap.get(comment.id))
            }
          } else {
            rootComments.push(commentMap.get(comment.id))
          }
        })

        console.log('Comentários processados com usernames:', rootComments) // Debug
        return rootComments
      }

      return []
    })
  },

  async addComment(reviewId: string, userId: string, comment: string, parentId?: string) {
    const supabase = createClient()
    return fetchWithRetry(async () => {
      const { data, error } = await supabase
        .from('review_comments')
        .insert({
          review_id: reviewId,
          user_id: userId,
          comment: comment.trim(),
          parent_id: parentId || null
        })
        .select()

      if (error) throw error
      return data
    })
  },

  async deleteComment(commentId: string, userId: string) {
    const supabase = createClient()
    return fetchWithRetry(async () => {
      const { error } = await supabase
        .from('review_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', userId)

      if (error) throw error
    })
  }
} 