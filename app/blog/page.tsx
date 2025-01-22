import { Metadata } from 'next'
import BlogCard from '@/components/BlogCard'
import Link from 'next/link'
import { createClient } from '@/utils/supabase-server'

export const metadata: Metadata = {
  title: 'Blog do Segundo Inquilino - Dicas e Informações sobre Aluguel',
  description: 'Encontre dicas valiosas, guias completos e informações essenciais sobre aluguel de imóveis. Aprenda sobre vistoria, direitos do inquilino e muito mais.',
  keywords: 'aluguel, apartamento, dicas de aluguel, guia do inquilino, segundo inquilino, review de apartamentos',
  robots: 'index, follow',
  openGraph: {
    title: 'Blog do Segundo Inquilino',
    description: 'Dicas e informações essenciais sobre aluguel de imóveis',
    type: 'website',
    url: 'https://segundoinquilino.com.br/blog',
    siteName: 'Segundo Inquilino',
  },
  alternates: {
    canonical: 'https://segundoinquilino.com.br/blog'
  },
  authors: [{ name: 'Segundo Inquilino' }],
  verification: {
    google: 'seu-código-de-verificação-do-google', // Você precisa adicionar o código do Google Search Console
  }
}

const blogPosts = [
  {
    title: 'Fatores essenciais para avaliar antes de alugar um apartamento',
    excerpt: 'Descubra os principais aspectos que você deve considerar antes de alugar um apartamento, desde a segurança do bairro até a qualidade do imóvel.',
    date: '15 de Março, 2024',
    slug: 'fatores-essenciais-aluguel',
    category: 'Guia do Inquilino'
  },
  {
    title: 'Como identificar uma boa localização para seu apartamento',
    excerpt: 'Aprenda a avaliar se a localização de um apartamento é adequada para suas necessidades, considerando transporte, serviços e segurança.',
    date: '14 de Março, 2024',
    slug: 'boa-localizacao-apartamento',
    category: 'Dicas Práticas'
  },
  {
    title: 'Problemas comuns ao alugar um apartamento',
    excerpt: 'Conheça os problemas mais frequentes que podem surgir durante a locação e saiba como evitá-los.',
    date: '13 de Março, 2024',
    slug: 'problemas-comuns-aluguel',
    category: 'Guia do Inquilino'
  },
  {
    title: 'Como avaliar a segurança do bairro antes de alugar',
    excerpt: 'Dicas práticas para verificar a segurança da região onde você pretende morar.',
    date: '12 de Março, 2024',
    slug: 'avaliar-seguranca-bairro',
    category: 'Dicas Práticas'
  },
  {
    title: 'Apartamento mobiliado vs. sem mobília: qual escolher?',
    excerpt: 'Entenda as vantagens e desvantagens de cada opção para fazer a melhor escolha.',
    date: '11 de Março, 2024',
    slug: 'mobiliado-vs-sem-mobilia',
    category: 'Direitos e Deveres'
  }
]

const categories = [
  {
    title: 'Guia do Inquilino',
    description: 'Dicas essenciais para locatários',
    count: blogPosts.filter(post => post.category === 'Guia do Inquilino').length
  },
  {
    title: 'Direitos e Deveres',
    description: 'Aspectos legais do aluguel',
    count: blogPosts.filter(post => post.category === 'Direitos e Deveres').length
  },
  {
    title: 'Dicas Práticas',
    description: 'Sugestões para o dia a dia',
    count: blogPosts.filter(post => post.category === 'Dicas Práticas').length
  }
]

export default async function BlogPage() {
  // Verificar se o usuário está logado
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const isLoggedIn = !!session?.user

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Mostrar o link apenas se não estiver logado */}
        {!isLoggedIn && (
          <div className="mb-8">
            <Link 
              href="/"
              className="text-purple-800 hover:text-purple-900 inline-flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
              Voltar para Home
            </Link>
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4">Blog do Segundo Inquilino</h1>
        <p className="text-xl text-gray-600 mb-12">
          Encontre dicas e informações úteis para te ajudar a tomar a melhor decisão 
          na hora de alugar seu imóvel.
        </p>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Posts em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <BlogCard
                key={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                slug={post.slug}
              />
            ))}
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Categorias</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <a 
                key={category.title}
                href={`/blog/categoria/${category.title.toLowerCase().replace(/ /g, '-')}`} 
                className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
                <span className="text-sm text-purple-600 mt-2 inline-block">
                  {category.count} {category.count === 1 ? 'post' : 'posts'}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 