import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Image
              src="/images/Logo_SI.png"
              alt="Segundo Inquilino Logo"
              width={300}
              height={300}
              className="mx-auto mb-8"
              priority
            />
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Sobre o Segundo Inquilino
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Conectando inquilinos e compartilhando experiências reais de moradia
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Nossa Missão */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Nossa Missão</h2>
          <p className="text-lg text-gray-600 mb-4">
            O Segundo Inquilino nasceu com o propósito de transformar a forma como as pessoas escolhem seus futuros lares. 
            Acreditamos que experiências reais de moradores anteriores são fundamentais para uma decisão mais consciente e segura.
          </p>
          <p className="text-lg text-gray-600">
            Nossa plataforma conecta inquilinos atuais e anteriores, criando uma comunidade onde informações valiosas sobre imóveis 
            são compartilhadas de forma transparente e construtiva.
          </p>
        </section>

        {/* Como Funcionamos */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Como Funcionamos</h2>
          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Reviews Autênticas</h3>
              <p className="text-gray-600">
                Todas as avaliações são feitas por usuários verificados que realmente moraram nos imóveis,
                garantindo informações autênticas e confiáveis.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Informações Detalhadas</h3>
              <p className="text-gray-600">
                Cada review inclui detalhes sobre infraestrutura, vizinhança, custos, qualidade de vida
                e outros aspectos essenciais para uma decisão informada.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Comunidade Engajada</h3>
              <p className="text-gray-600">
                Nossa plataforma promove interações construtivas entre usuários, permitindo perguntas,
                comentários e compartilhamento de experiências.
              </p>
            </div>
          </div>
        </section>

        {/* Segurança e Privacidade */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Segurança e Privacidade</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              <strong className="text-gray-900">Proteção de Dados:</strong> Utilizamos tecnologias 
              avançadas de criptografia e seguimos rigorosos protocolos de segurança para proteger 
              suas informações pessoais.
            </p>
            <p>
              <strong className="text-gray-900">Política de Cookies:</strong> Utilizamos cookies 
              essenciais para melhorar sua experiência na plataforma. Todos os dados coletados 
              são tratados conforme nossa política de privacidade.
            </p>
            <p>
              <strong className="text-gray-900">Verificação de Usuários:</strong> Implementamos 
              um sistema robusto de verificação para garantir a autenticidade das reviews e 
              a segurança da comunidade.
            </p>
          </div>
        </section>

        {/* Contato */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Entre em Contato</h2>
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <p className="text-gray-600 mb-4">
              Estamos sempre abertos para ouvir suas sugestões, dúvidas ou feedbacks. Entre em 
              contato conosco através do email:
            </p>
            <a 
              href="mailto:contato@segundoinquilino.com.br"
              className="text-lg font-medium text-purple-600 hover:text-purple-700"
            >
              contato@segundoinquilino.com.br
            </a>
          </div>
        </section>

        {/* Links Úteis */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Links Úteis</h2>
          <div className="grid gap-4">
            <Link 
              href="/terms"
              className="text-purple-600 hover:text-purple-700 hover:underline"
            >
              Termos e Condições
            </Link>
            <Link 
              href="/reviews"
              className="text-purple-600 hover:text-purple-700 hover:underline"
            >
              Explorar Reviews
            </Link>
            <Link 
              href="/auth"
              className="text-purple-600 hover:text-purple-700 hover:underline"
            >
              Criar uma Conta
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
} 