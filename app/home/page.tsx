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

  // Criar mapa de usuários
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
      <div className="relative pt-16 pb-24 sm:pt-20 sm:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block mb-2">Bem-vindo ao</span>
              <span className="block text-purple-800">Segundo Inquilino</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
              Encontre avaliações reais de apartamentos e compartilhe suas experiências.
            </p>
            <div className="mt-4">
              <Link
                href="/reviews"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-800 hover:bg-purple-900 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
                Busque Reviews
              </Link>
            </div>
          </div>
        </div>
      </div>
    </HomeContent>
  )
} 