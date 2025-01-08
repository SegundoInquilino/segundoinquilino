import Link from 'next/link'
import Image from 'next/image'
import ExampleReviewCarousel from '@/components/ExampleReviewCarousel'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-12">
            <Image
              src="/images/Logo_SI.png"
              alt="Segundo Inquilino Logo"
              width={200}
              height={200}
              className="h-auto w-auto"
              priority
            />
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Bem-vindo ao
            <span className="block text-purple-800">Segundo Inquilino</span>
            </h1>
          
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            A plataforma que conecta inquilinos e compartilha experiências reais sobre apartamentos.
            Tome decisões mais seguras baseadas em avaliações autênticas.
          </p>

          <div className="mt-8 max-w-3xl mx-auto px-6 py-5 bg-purple-50 rounded-xl border border-purple-100 shadow-sm">
            <p className="text-lg md:text-xl text-purple-800 font-medium leading-relaxed">
              "Ajude outros inquilinos a escolherem melhor - 
              <span className="block mt-1 text-purple-700">
                sua experiência pode evitar dores de cabeça e garantir um lar mais seguro e confiável"
              </span>
            </p>
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/auth"
              className="inline-flex items-center px-12 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-purple-800 hover:bg-purple-900 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Comece Agora
            </Link>
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
        </div>
  )
} 