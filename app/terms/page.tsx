'use client'

import Image from 'next/image'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <Image
            src="/images/Logo_SI.png"
            alt="Segundo Inquilino Logo"
            width={200}
            height={70}
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Termos e Condições
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              1. Aceitação dos Termos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Ao acessar e usar o Segundo Inquilino, você concorda em cumprir estes termos e condições.
              Caso você não concorde com algum aspecto destes termos, recomendamos que não utilize nossos serviços.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              2. Uso do Serviço
            </h2>
            <p className="text-gray-600 leading-relaxed">
              O Segundo Inquilino é uma plataforma que permite aos usuários compartilhar e acessar avaliações
              sobre imóveis para aluguel. Ao utilizar nosso serviço, você concorda em:
            </p>
            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-2">
              <li>Fornecer informações verdadeiras e precisas</li>
              <li>Não publicar conteúdo difamatório ou prejudicial</li>
              <li>Respeitar a privacidade de outros usuários</li>
              <li>Não usar o serviço para fins ilegais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              3. Conteúdo do Usuário
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Ao publicar conteúdo em nossa plataforma, você mantém seus direitos autorais, mas concede
              ao Segundo Inquilino uma licença para usar, modificar, exibir e distribuir esse conteúdo
              na plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              4. Privacidade
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Respeitamos sua privacidade e protegemos seus dados pessoais. Para mais informações,
              consulte nossa Política de Privacidade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              5. Modificações dos Termos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações
              significativas serão notificadas aos usuários.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              6. Contato
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Para dúvidas sobre estes termos, entre em contato conosco através do email: contato@segundoinquilino.com.br
            </p>
          </section>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Última atualização: {new Date().toLocaleDateString('pt-BR')}
        </p>
      </div>
    </div>
  )
} 