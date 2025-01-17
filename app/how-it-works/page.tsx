import Link from 'next/link'

export default function HowItWorksPage() {
  const steps = [
    {
      title: 'Solicite uma Review',
      description: 'Preencha um formulário simples com informações do imóvel que você quer conhecer melhor.',
      icon: '📝'
    },
    {
      title: 'Aguarde a Resposta',
      description: 'Nossa comunidade de ex-moradores receberá sua solicitação e alguém que realmente morou no local responderá.',
      icon: '⏳'
    },
    {
      title: 'Receba a Review',
      description: 'Você receberá um email quando sua review estiver pronta. A review é privada e só você terá acesso.',
      icon: '✉️'
    },
    {
      title: 'Tome sua Decisão',
      description: 'Com informações reais de quem já morou no local, você pode tomar uma decisão mais segura.',
      icon: '✅'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Como Funciona o Segundo Inquilino
            </h1>
            <p className="text-xl text-gray-600">
              Descubra como nosso processo ajuda você a tomar decisões mais seguras sobre seu próximo lar
            </p>
          </div>

          {/* Passos */}
          <div className="grid gap-8 md:grid-cols-2 mb-12">
            {steps.map((step, index) => (
              <div 
                key={step.title}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Seção de Garantias */}
          <div className="bg-white rounded-xl p-8 shadow-sm mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Nosso Compromisso
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Reviews Autênticas
                </h3>
                <p className="text-gray-600">
                  Apenas pessoas que realmente moraram no local podem fazer reviews.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Privacidade
                </h3>
                <p className="text-gray-600">
                  Suas reviews solicitadas são privadas e só você tem acesso.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Transparência
                </h3>
                <p className="text-gray-600">
                  Informações reais e honestas para sua tomada de decisão.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link
              href="/review-requests"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Solicitar uma Review Agora
            </Link>
            <p className="mt-4 text-gray-600">
              Comece agora a tomar decisões mais seguras sobre seu próximo lar
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 