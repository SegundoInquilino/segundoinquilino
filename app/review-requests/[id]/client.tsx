'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ReviewForm from '@/components/ReviewForm'
import toast from 'react-hot-toast'

type ReviewRequest = Database['public']['Tables']['review_requests']['Row'] & {
  id: string
  building_name: string
  address: string
  email: string
  zip_code: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  notes: string | null
  status: 'pending' | 'completed' | 'rejected'
  created_at: string
}

interface RequestDetailsClientProps {
  request: ReviewRequest
  user: User
}

export default function RequestDetailsClient({ request, user }: RequestDetailsClientProps) {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [error, setError] = useState('')

  console.log('Dados da solicitação no cliente:', request)

  const handleReviewSubmit = async (reviewData: any) => {
    try {
      // Validar se temos todos os dados necessários
      if (!request || !request.id || !request.email) {
        throw new Error('Dados da solicitação incompletos')
      }

      // Validar dados do formulário
      if (!reviewData.content || !reviewData.rating) {
        throw new Error('Por favor, preencha todos os campos obrigatórios')
      }

      // Primeiro verificar se o apartamento já existe
      const { data: existingApartment, error: searchError } = await supabase
        .from('apartments')
        .select()
        .eq('building_name', reviewData.apartments.building_name)
        .eq('address', reviewData.apartments.address)
        .single()

      if (searchError && searchError.code !== 'PGRST116') {
        throw new Error(`Erro ao buscar apartamento: ${searchError.message}`)
      }

      let apartment = existingApartment

      // Se não existir, criar novo apartamento
      if (!apartment) {
        const apartmentData = {
          building_name: reviewData.apartments.building_name,
          address: reviewData.apartments.address,
          neighborhood: reviewData.apartments.neighborhood,
          city: reviewData.apartments.city,
          state: reviewData.apartments.state,
          property_type: reviewData.apartments.property_type,
          created_at: new Date().toISOString(),
          zip_code: reviewData.apartments.zip_code || '00000-000',
          latitude: null,
          longitude: null
        }

        const { data: newApartment, error: insertError } = await supabase
          .from('apartments')
          .insert(apartmentData)
          .select()
          .single()

        if (insertError) {
          throw new Error(`Erro ao criar apartamento: ${insertError.message}`)
        }

        apartment = newApartment
      }

      // Criar a review vinculada à solicitação
      const reviewDataToInsert = {
        content: reviewData.content,
        rating: reviewData.rating,
        user_id: user.id,
        apartment_id: apartment.id,
        created_at: new Date().toISOString(),
        request_id: request.id,
        requester_email: request.email
      }

      const { error: reviewError } = await supabase
        .from('reviews')
        .insert(reviewDataToInsert)

      if (reviewError) {
        throw new Error(`Erro ao criar review: ${reviewError.message}`)
      }

      // Atualizar o status da solicitação
      const { error: updateError } = await supabase
        .from('review_requests')
        .update({ status: 'completed' })
        .eq('id', request.id)

      if (updateError) {
        throw new Error(`Erro ao atualizar status: ${updateError.message}`)
      }

      // Após criar a review e atualizar o status, enviar o email
      if (request.email) {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: request.email,
            buildingName: request.building_name,
            reviewerName: user.user_metadata?.full_name || 'Um usuário',
          }),
        })

        if (!emailResponse.ok) {
          console.error('Erro ao enviar email de notificação:', await emailResponse.json())
          // Não vamos lançar erro aqui para não interromper o fluxo principal
        }
      }

      toast.success('Obrigado por responder a review! 🎉', {
        duration: 5000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '10px',
        },
        icon: '👏',
      })

      router.push('/review-requests')
    } catch (err: any) {
      // Tratamento de erro mais detalhado
      let errorMessage = 'Erro ao criar review. Por favor, tente novamente.'
      
      if (err instanceof Error) {
        errorMessage = err.message
        console.error('Erro detalhado:', {
          name: err.name,
          message: err.message,
          stack: err.stack
        })
      } else {
        console.error('Erro desconhecido:', err)
      }

      setError(errorMessage)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/review-requests"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Voltar para solicitações
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">{request.building_name}</h1>
          <p className="text-gray-600 mb-4">{request.address}</p>
          
          {request.notes && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Observações</h2>
              <p className="text-gray-600">{request.notes}</p>
            </div>
          )}

          {request.status === 'pending' ? (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Criar Review</h2>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <ReviewForm 
                initialData={{
                  building_name: request.building_name,
                  address: request.address,
                  zip_code: request.zip_code || '00000-000',
                  neighborhood: request.neighborhood || 'Centro Histórico de São Paulo',
                  city: request.city || 'São Paulo',
                  state: request.state || 'São Paulo'
                }}
                onSubmit={handleReviewSubmit}
              />
            </div>
          ) : (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                Esta solicitação já foi {request.status === 'completed' ? 'atendida' : 'rejeitada'}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 