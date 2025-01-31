import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import VisitReviewForm from '@/components/VisitReviewForm'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default async function NewVisitReviewPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700">
            Você precisa estar logado para criar uma avaliação.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/visit-reviews"
          className="inline-flex items-center text-sm text-gray-500 hover:text-purple-600"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Voltar para avaliações de visitas
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Nova Avaliação de Visita
      </h1>

      <VisitReviewForm userId={session.user.id} />
    </div>
  )
} 