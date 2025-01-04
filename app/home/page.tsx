import { createClient } from '@/utils/supabase-server'
import ReviewsList from '@/components/ReviewsList'
import Link from 'next/link'

// Adicionar interface para Profile e UserMap
interface Profile {
  id: string
  username: string
}

interface UserMap {
  [key: string]: string
}

export default async function HomePage() {
  const supabase = createServerClient()

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
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Segundo Inquilino
            </h1>
            <p className="text-xl mb-12 text-primary-100">
              Encontre e compartilhe experiências reais sobre apartamentos para alugar
            </p>
            <Link
              href="/new-review"
              className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-secondary-600 rounded-full hover:bg-secondary-500 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>Criar Nova Review</span>
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Reviews Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Reviews Recentes</h2>
            <Link
              href="/reviews"
              className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
            >
              Ver todas
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
          <ReviewsList
            reviews={recentReviews || []}
            userMap={userMap}
            currentUserId={currentUserId}
          />
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Melhores Avaliações</h2>
          <ReviewsList
            reviews={topReviews || []}
            userMap={userMap}
            currentUserId={currentUserId}
          />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Compartilhe Sua Experiência
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Ajude outros inquilinos a encontrar o lugar perfeito compartilhando sua experiência com um apartamento.
          </p>
          <Link
            href="/new-review"
            className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-secondary-600 rounded-full hover:bg-secondary-500 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Criar Nova Review
          </Link>
        </div>
      </section>
    </main>
  )
} 