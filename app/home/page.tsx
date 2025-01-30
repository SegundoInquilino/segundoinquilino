import { createClient } from '@/utils/supabase-server'
import HomeContent from '@/components/HomeContent'
import Link from 'next/link'
import { getRegionStats } from '@/utils/region-stats'

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
    .is('requester_email', null)
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
    .is('requester_email', null)
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

  const regionStats = await getRegionStats()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Nova seção de CTA */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            Visitou um imóvel recentemente?
          </h3>
          <p className="text-purple-700 mb-4">
            Compartilhe sua experiência e ajude outros inquilinos a encontrarem o lugar ideal.
          </p>
          <div className="space-x-4">
            <Link
              href="/visit-reviews"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Ver Reviews de Visitas
            </Link>
            <Link
              href="/visit-reviews/new"
              className="inline-flex items-center px-4 py-2 border border-purple-200 text-sm font-medium rounded-md shadow-sm text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Criar Review
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Já está morando de aluguel?
          </h3>
          <p className="text-blue-700 mb-4">
            Conte sua experiência com o imóvel e ajude futuros inquilinos a tomarem a melhor decisão.
          </p>
          <div className="space-x-4">
            <Link
              href="/reviews"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ver Reviews de Imóveis
            </Link>
            <Link
              href="/new-review"
              className="inline-flex items-center px-4 py-2 border border-blue-200 text-sm font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Criar Review
            </Link>
          </div>
        </div>
      </div>

      {/* Título existente */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Reviews Recentes
      </h2>

      <HomeContent 
        initialReviews={recentReviews || []}
        topReviews={topReviews || []}
        userMap={userMap}
        currentUserId={currentUserId}
        regionStats={regionStats}
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
    </div>
  )
} 