import { createClient } from '@/utils/supabase-server'
import HomeContent from '@/components/HomeContent'
import Link from 'next/link'

// Adicionar interfaces
interface Profile {
  id: string
  username: string
}

type UserMap = Record<string, string>

export default async function HomePage() {
  const supabase = createClient()

  // Buscar as reviews mais recentes (limitado a 6)
  const { data: recentReviews } = await supabase
    .from('reviews')
    .select(`
      *,
      apartments (*),
      likes_count:review_likes(count)
    `)
    .order('created_at', { ascending: false })
    .limit(6)

  // Buscar as reviews mais bem avaliadas
  const { data: topReviews } = await supabase
    .from('reviews')
    .select(`
      *,
      apartments (*),
      likes_count:review_likes(count)
    `)
    .order('rating', { ascending: false })
    .limit(3)

  // Verificar usuário atual
  const { data: { user } } = await supabase.auth.getUser()
  const currentUserId = user?.id

  // Buscar usuários para os nomes
  const allReviews = [...(recentReviews || []), ...(topReviews || [])]
  const userIds = Array.from(new Set(allReviews.map(r => r.user_id)))
  
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username')
    .in('id', userIds)

  // Criar mapa de usuários com tipagem correta
  const userMap: UserMap = {}
  profiles?.forEach((profile: Profile) => {
    userMap[profile.id] = profile.username || 'Usuário'
  })

  return (
    <HomeContent 
      initialReviews={recentReviews || []}
      topReviews={topReviews || []}
      userMap={userMap}
      currentUserId={currentUserId}
    >
      <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-gray-900 py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-white tracking-tight sm:text-6xl md:text-7xl">
              Segundo Inquilino
            </h1>
            
            <p className="mt-6 text-xl text-purple-100 max-w-2xl mx-auto">
              Encontre e compartilhe experiências reais sobre apartamentos para alugar
            </p>

            <div className="mt-10">
              <Link
                href="/new-review"
                className="inline-flex items-center px-8 py-3 border border-transparent 
                         text-base font-medium rounded-full text-purple-900 bg-white 
                         hover:bg-purple-50 transition-all duration-200 
                         shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Criar Nova Review
                <svg 
                  className="ml-2 -mr-1 w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Efeito de gradiente decorativo */}
        <div className="absolute inset-x-0 bottom-0">
          <div className="h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent opacity-20"></div>
        </div>

        {/* Efeito de fundo adicional */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 to-transparent"></div>
      </div>
    </HomeContent>
  )
} 