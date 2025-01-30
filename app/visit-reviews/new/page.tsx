'use client'

import VisitReviewForm from '@/components/VisitReviewForm'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NewVisitReviewPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Botão de voltar */}
      <div className="mb-6">
        <Link
          href="/visit-reviews"
          className="inline-flex items-center text-sm text-gray-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Voltar para reviews de visitas
        </Link>
      </div>

      {/* Seção de boas-vindas e diretrizes */}
      <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-lg shadow-sm mb-8 border border-purple-100">
        <div className="border-l-4 border-purple-500 pl-4 mb-6">
          <h2 className="text-lg font-semibold text-purple-900 mb-4">
            O que é uma Review de Visita?
          </h2>
          <p className="text-gray-600 mb-4">
            Uma review de visita é um relato da sua experiência ao visitar um imóvel. 
            Aqui você pode compartilhar suas impressões iniciais, pontos positivos e negativos 
            observados durante a visita, ajudando outros usuários a terem uma ideia melhor 
            do imóvel antes mesmo de visitá-lo.
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-md font-semibold text-purple-800 mb-3 flex items-center">
            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Diretrizes para uma boa review:
          </h3>
          <ul className="list-none text-gray-600 space-y-2 mb-4">
            {[
              'Seja objetivo e honesto em suas observações',
              'Inclua informações relevantes sobre a estrutura e estado do imóvel',
              'Mencione aspectos importantes como iluminação, ventilação e barulhos',
              'Adicione fotos para ilustrar melhor sua experiência',
              'Evite informações pessoais ou que possam identificar moradores',
              'Mantenha um tom construtivo e respeitoso'
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>

          <p className="text-sm text-purple-600 bg-purple-50 p-3 rounded-md">
            Suas experiências são valiosas e podem ajudar outros usuários a tomarem 
            decisões mais informadas em suas buscas por imóveis.
          </p>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Nova Review de Visita
      </h1>

      <VisitReviewForm />
    </div>
  )
} 