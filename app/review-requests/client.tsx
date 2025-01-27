'use client'

import { User } from '@supabase/auth-helpers-nextjs'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import RequestReviewModal from '@/components/RequestReviewModal'
import { Database } from '@/types/supabase'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { createClient } from '@/utils/supabase-client'
import { toast } from 'react-hot-toast'
import DeleteReviewRequestButton from '@/components/DeleteReviewRequestButton'

type ReviewRequest = Database['public']['Tables']['review_requests']['Row'] & {
  id: string
  building_name: string
  address: string
  status: 'pending' | 'completed' | 'rejected'
  created_at: string
  expires_at?: string
  user_id: string
  user_email: string
}

interface ReviewRequestsClientProps {
  initialRequests: ReviewRequest[]
  user: User
}

export default function ReviewRequestsClient({ initialRequests, user }: ReviewRequestsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [requests, setRequests] = useState(initialRequests)

  const handleRequestDeleted = async (deletedRequestId: string) => {
    // Atualizar a lista removendo o request deletado
    setRequests(prev => prev.filter(req => req.id !== deletedRequestId))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Seção de Introdução */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Solicitações de Review
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Aqui você pode solicitar reviews privadas de imóveis e acompanhar suas solicitações. 
            Nossas reviews são feitas por pessoas que realmente moraram no local.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Solicitar Nova Review
            </button>
            <Link 
              href="/how-it-works"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Como Funciona?
            </Link>
          </div>
        </div>

        {/* Lista de Solicitações */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Solicitações Recentes de Reviews
          </h2>

          {requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                Você ainda não tem nenhuma solicitação de review.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Fazer Primeira Solicitação
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requests.map((request) => {
                // Adicionar temporariamente para debug
                console.log({
                  requestUserId: request.user_id,
                  currentUserId: user.id,
                  isMatch: request.user_id === user.id,
                  request: request
                })

                const uniqueKey = `request-${request.id}-${request.building_name}-${request.created_at}`
                
                // Calcula o tempo restante apenas se expires_at existir
                let timeLeftText = ''
                if (request.expires_at) {
                  try {
                    const expiresAt = new Date(request.expires_at)
                    timeLeftText = formatDistanceToNow(expiresAt, { 
                      locale: ptBR,
                      addSuffix: true 
                    })
                  } catch (error) {
                    console.error('Erro ao formatar data:', error)
                    timeLeftText = 'Data não disponível'
                  }
                }

                return (
                  <div 
                    key={uniqueKey} 
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900">
                        {request.building_name}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                        request.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status === 'completed' ? 'Respondido' : 
                         request.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      {request.address}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-500">
                          Criado {formatDistanceToNow(new Date(request.created_at), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </span>
                        {request.expires_at && (
                          <span className="text-xs text-gray-500">
                            Expira {timeLeftText}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/review-requests/${request.id}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Ver detalhes →
                        </Link>
                        
                        {request.user_email === user.email && (
                          <DeleteReviewRequestButton
                            requestId={request.id}
                            requestAuthorEmail={request.user_email}
                            currentUserEmail={user.email}
                            onRequestDeleted={() => handleRequestDeleted(request.id)}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <RequestReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
} 