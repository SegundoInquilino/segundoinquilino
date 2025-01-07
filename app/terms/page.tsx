import Image from 'next/image'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Cabeçalho com Logo */}
        <div className="text-center mb-12">
          <Image
            src="/images/Logo_SI.png"
            alt="Segundo Inquilino Logo"
            width={120}
            height={120}
            className="h-auto w-auto mx-auto mb-6"
            priority
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Termos e Condições
          </h1>
          <p className="text-gray-600">
            Última atualização: {new Date().toLocaleDateString('pt-BR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8 md:p-12 space-y-8">
          <section className="prose prose-purple max-w-none">
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Aceitação dos Termos</h2>
                <p className="text-gray-600 leading-relaxed">
                  Ao acessar e usar o Segundo Inquilino, você concorda em cumprir e estar vinculado a estes Termos e Condições. 
                  Se você não concordar com qualquer parte destes termos, não poderá acessar o serviço.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Uso do Serviço</h2>
                <p className="text-gray-600 leading-relaxed">
                  O Segundo Inquilino é uma plataforma que permite aos usuários compartilhar e acessar avaliações sobre 
                  experiências em imóveis. Todas as avaliações devem ser baseadas em experiências reais e verdadeiras.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Conteúdo do Usuário</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Ao publicar conteúdo na plataforma, você garante que:
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>As informações são verdadeiras e baseadas em experiência real</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Você tem os direitos necessários para publicar o conteúdo</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>O conteúdo não viola direitos de terceiros</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>O conteúdo não é difamatório ou prejudicial</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Responsabilidades</h2>
                <p className="text-gray-600 leading-relaxed">
                  O Segundo Inquilino não se responsabiliza pela precisão das avaliações publicadas pelos usuários. 
                  Nos reservamos o direito de remover conteúdo que viole estes termos.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Privacidade</h2>
                <p className="text-gray-600 leading-relaxed">
                  Respeitamos sua privacidade e protegemos seus dados pessoais. Para mais informações, 
                  consulte nossa Política de Privacidade.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Modificações</h2>
                <p className="text-gray-600 leading-relaxed">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                  Alterações significativas serão notificadas aos usuários.
                </p>
              </div>
            </div>
          </section>

          {/* Assinatura */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-col items-center space-y-4">
              <Image
                src="/images/Logo_SI.png"
                alt="Segundo Inquilino Logo"
                width={80}
                height={80}
                className="h-auto w-auto opacity-75"
              />
              <p className="text-gray-500 text-center text-sm">
                © {new Date().getFullYear()} Segundo Inquilino. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 