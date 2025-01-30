'use client'

import Link from 'next/link'
import Image from 'next/image'
import ExampleReviewCarousel from '@/components/ExampleReviewCarousel'
import ReviewCardWrapper from '@/components/ReviewCardWrapper'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Review } from '@/types/review'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { createClient } from '@/utils/supabase-client-server'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Segundo Inquilino',
  description: 'Plataforma de avaliações reais de apartamentos e experiências de moradia',
  url: 'https://segundoinquilino.com.br',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://segundoinquilino.com.br/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
}

async function getRegionStats() {
  const supabase = createClient()
  
  type ReviewWithApartment = {
    apartments: {
      neighborhood: string
    }
  }

  const { data } = await supabase
    .from('reviews')
    .select(`
      apartments!inner (
        neighborhood
      )
    `)
    .not('apartments.neighborhood', 'is', null)
    .returns<ReviewWithApartment[]>()

  if (!data) return []

  // Agrupa e conta por bairro
  const stats = data.reduce((acc, review) => {
    const neighborhood = review.apartments.neighborhood
    if (neighborhood) {
      acc[neighborhood] = (acc[neighborhood] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  // Converte para array e ordena por contagem
  return Object.entries(stats)
    .map(([neighborhood, count]) => ({ neighborhood, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Pega os 5 principais bairros
}

export default async function HomePage() {
  const regionStats = await getRegionStats()
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-12">
              <Image
                src="/images/favicon-96x96.png"
                alt="Segundo Inquilino Logo"
                width={150}
                height={150}
                className="h-auto w-auto"
                priority
              />
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Bem-vindo ao
              <span className="block text-purple-800">Segundo Inquilino</span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            
              <b>Sua experiência pode ajudar outros inquilinos!</b> Avalie seu imóvel e descubra o que outros moradores dizem. No Segundo Inquilino, você encontra <b>opiniões reais</b> para tomar decisões mais seguras.
            </p>

            <div className="mt-8 flex flex-col items-center space-y-4">
              <Link
                href="/home"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-purple-800 hover:bg-purple-900 transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Veja alguns dos reviews
              </Link>
              
              <Link
                href="/auth"
                className="inline-flex items-center px-8 py-4 border border-purple-800 text-lg font-medium rounded-md text-purple-800 bg-white hover:bg-purple-50 transition-colors duration-200 shadow-sm hover:shadow-md"
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
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Faça login ou cadastre
              </Link>
            </div>

            <div className="mt-12 bg-purple-50 py-12 rounded-3xl">
              <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                  O que você quer saber sobre o Edifico/Casa? 🤔
                </h2>

              
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-3">🏊‍♂️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Possui piscina?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Descubra as áreas de lazer
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-3">🛡️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      É um lugar seguro?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Avalie a segurança da região
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-3">🛒</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Tem mercado perto?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Veja a localização e serviços
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-3">👋</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Os vizinhos são legais?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Conheça o perfil da vizinhança
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-3">🌙</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Muito barulho à noite?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Saiba sobre a tranquilidade do local
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 max-w-3xl mx-auto px-6 py-5 bg-purple-50 rounded-xl border border-purple-100 shadow-sm">
              <p className="text-lg md:text-xl text-purple-800 font-medium leading-relaxed">
                <b>"Ajude outros inquilinos a escolherem melhor!</b>
                <span className="block mt-1 text-purple-700">
                  sua experiência pode evitar dores de cabeça e garantir um lar mais seguro e confiável"
                </span>
              </p>
            </div>

            <div className="mt-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Veja exemplos de avaliações
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Descubra o tipo de informação que você encontrará em nossa plataforma
                </p>
              </div>
              
              <ExampleReviewCarousel />
            </div>
          </div>
        </div>

        <div className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Como funciona o Segundo Inquilino
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Conectamos pessoas que já moraram em um apartamento com futuros inquilinos
              </p>
            </div>

            <div className="mt-20">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="text-purple-800 text-4xl font-bold mb-4">01</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Experiências Reais
                  </h3>
                  <p className="text-gray-600">
                    Acesse avaliações autênticas de pessoas que realmente moraram no apartamento.
                    Descubra detalhes que só quem viveu no local pode compartilhar.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="text-purple-800 text-4xl font-bold mb-4">02</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Informações Detalhadas
                  </h3>
                  <p className="text-gray-600">
                    Saiba tudo sobre o apartamento: qualidade da construção, 
                    vizinhança, barulhos, administração do condomínio e muito mais.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow">
                  <div className="text-purple-800 text-4xl font-bold mb-4">03</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Decisão Consciente
                  </h3>
                  <p className="text-gray-600">
                    Tome sua decisão com base em experiências reais. 
                    Evite surpresas desagradáveis e encontre o lar ideal para você.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 bg-purple-50 py-16 rounded-3xl">
              <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                  Encontre o que você procura! 🔍
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">🏊‍♂️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Possui piscina?
                    </h3>
                    <p className="text-gray-600">
                      Descubra apartamentos com áreas de lazer completas
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">🚗️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      É um lugar seguro?
                    </h3>
                    <p className="text-gray-600">
                      Saiba tudo sobre a segurança do local e da região
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">🛒</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Tem mercado por perto?
                    </h3>
                    <p className="text-gray-600">
                      Confira a proximidade com comércios e serviços
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">🔇</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Como é o barulho?
                    </h3>
                    <p className="text-gray-600">
                      Avaliações sobre acústica e ruídos do apartamento
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-4xl mb-4">🚗</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Tem garagem?
                    </h3>
                    <p className="text-gray-600">
                      Informações sobre estacionamento e vagas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-32">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="bg-purple-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Para quem procura um apartamento
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-purple-800 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">Acesse avaliações detalhadas e honestas</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-purple-800 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">Conheça problemas e vantagens do imóvel</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-purple-800 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">Tome decisões mais seguras</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Para quem já morou no apartamento
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-purple-800 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">Compartilhe sua experiência</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-purple-800 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">Ajude outros inquilinos</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-purple-800 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">Contribua para decisões mais conscientes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-32 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Veja como são as avaliações
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Um exemplo do tipo de informação que você encontrará em nossa plataforma
            </p>
          </div>
          
          <ExampleReviewCarousel />
        </div>

        <section className="py-12 bg-gray-50" id="blog">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Blog do Segundo Inquilino</h2>
              <p className="text-gray-600 mb-8">
                Encontre dicas valiosas e informações essenciais sobre aluguel de imóveis
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Guia do Inquilino</h3>
                  <p className="text-gray-600 mb-4">Dicas essenciais para antes, durante e depois do aluguel</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Direitos e Deveres</h3>
                  <p className="text-gray-600 mb-4">O que você precisa saber sobre legislação de aluguel</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-3">Dicas de Vistoria</h3>
                  <p className="text-gray-600 mb-4">Como fazer uma vistoria detalhada do imóvel</p>
                </div>
              </div>

              <a 
                href="/blog" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-800 hover:bg-purple-900"
              >
                Acessar o Blog
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
} 