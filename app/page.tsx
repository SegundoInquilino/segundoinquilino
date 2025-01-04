import Link from 'next/link'
import { createClient } from '@/utils/supabase-server'
import { redirect } from 'next/navigation'

export default async function LandingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Se já estiver logado, redireciona para /home
  if (user) {
    redirect('/home')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-600 to-secondary-700">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Segundo Inquilino
            </h1>
            <p className="text-2xl mb-12 text-primary-100">
              A plataforma que conecta inquilinos e compartilha experiências reais sobre apartamentos para alugar
            </p>
            <div className="space-x-4">
              <Link
                href="/auth"
                className="inline-flex items-center px-8 py-3 text-lg font-semibold text-primary-600 bg-white rounded-full hover:bg-primary-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Criar Conta
              </Link>
              <Link
                href="/auth?mode=login"
                className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white border-2 border-white rounded-full hover:bg-white/10 transition-colors duration-200"
              >
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Por que usar o Segundo Inquilino?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Experiências Reais</h3>
              <p className="text-gray-600">
                Avaliações autênticas de pessoas que realmente moraram nos apartamentos
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Comunidade Ativa</h3>
              <p className="text-gray-600">
                Interaja com outros inquilinos e compartilhe suas experiências
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Decisões Informadas</h3>
              <p className="text-gray-600">
                Tome decisões mais seguras com base em experiências reais
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Comece Agora Mesmo
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de inquilinos que já compartilham suas experiências
          </p>
          <Link
            href="/auth"
            className="inline-flex items-center px-8 py-3 text-lg font-semibold text-primary-600 bg-white rounded-full hover:bg-primary-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Criar Conta Gratuita
          </Link>
        </div>
      </section>
    </main>
  )
} 