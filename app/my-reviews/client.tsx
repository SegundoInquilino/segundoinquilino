'use client'

import Link from 'next/link'
import { StarRating } from '@/components/ui/star-rating'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface MyReviewsClientProps {
  requests: any[]
  reviewers: Record<string, string>
}

export default function MyReviewsClient({ requests, reviewers }: MyReviewsClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Reviews Respondidas</h1>
          <Link
            href="/profile"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Voltar ao Perfil
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">
              Você ainda não tem reviews respondidas.
            </p>
            <Link 
              href="/review-requests"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Solicitar uma Review
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div key={`${request.id}-${request.reviews[0]?.id}`} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">
                        {request.building_name}
                      </h2>
                      <p className="text-gray-600">
                        {request.address}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(request.reviews[0].created_at), {
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <StarRating rating={request.reviews[0].rating} editable={false} />
                      <span className="text-gray-600">
                        ({request.reviews[0].rating}/5)
                      </span>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Review Privada
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      Avaliado por {reviewers[request.reviews[0].user_id] || 'Usuário'}
                    </p>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {request.reviews[0].content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 