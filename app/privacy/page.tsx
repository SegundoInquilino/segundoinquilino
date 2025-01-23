import { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheckIcon, LockClosedIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'Política de Privacidade | Segundo Inquilino',
  description: 'Nossa política de privacidade explica como tratamos seus dados pessoais e cookies.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Política de Privacidade
          </h1>
          <p className="text-lg text-gray-600">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Cards de Destaques */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <ShieldCheckIcon className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Proteção de Dados</h3>
            <p className="text-gray-600">Seus dados são protegidos e utilizados apenas para melhorar sua experiência.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <LockClosedIcon className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Segurança</h3>
            <p className="text-gray-600">Utilizamos criptografia e práticas seguras para proteger suas informações.</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <DocumentTextIcon className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Transparência</h3>
            <p className="text-gray-600">Explicamos de forma clara como suas informações são utilizadas.</p>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="bg-white rounded-xl shadow-sm p-8 prose prose-purple max-w-none">
          <h2>1. Informações que coletamos</h2>
          <p>
            Coletamos informações que você nos fornece diretamente ao:
          </p>
          <ul>
            <li>Criar uma conta</li>
            <li>Publicar uma review</li>
            <li>Entrar em contato conosco</li>
            <li>Utilizar nossos serviços</li>
          </ul>

          <h2>2. Como usamos suas informações</h2>
          <p>
            Utilizamos suas informações para:
          </p>
          <ul>
            <li>Fornecer e melhorar nossos serviços</li>
            <li>Personalizar sua experiência</li>
            <li>Enviar atualizações importantes</li>
            <li>Garantir a segurança da plataforma</li>
          </ul>

          <h2>3. Cookies e tecnologias similares</h2>
          <p>
            Utilizamos cookies e tecnologias similares para melhorar sua experiência e coletar dados de uso.
            Você pode controlar o uso de cookies através das configurações do seu navegador.
          </p>

          <h2>4. Compartilhamento de informações</h2>
          <p>
            Não vendemos suas informações pessoais. Compartilhamos dados apenas quando:
          </p>
          <ul>
            <li>Você autoriza expressamente</li>
            <li>É necessário para fornecer o serviço</li>
            <li>Somos obrigados por lei</li>
          </ul>

          <h2>5. Seus direitos</h2>
          <p>
            Você tem direito a:
          </p>
          <ul>
            <li>Acessar seus dados</li>
            <li>Corrigir informações incorretas</li>
            <li>Solicitar exclusão de dados</li>
            <li>Revogar consentimentos</li>
          </ul>

          <h2>6. Contato</h2>
          <p>
            Para questões sobre privacidade, entre em contato através do email:{' '}
            <a href="mailto:contato@segundoinquilino.com.br">
              contato@segundoinquilino.com.br
            </a>
          </p>
        </div>

        {/* Botão de Voltar */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-purple-600 hover:text-purple-800 font-medium"
          >
            ← Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  )
} 