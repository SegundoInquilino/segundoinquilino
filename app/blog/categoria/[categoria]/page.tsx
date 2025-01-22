import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogCard from '@/components/BlogCard'
import Link from 'next/link'

// Dados das categorias
const categoryData = {
  'guia-do-inquilino': {
    title: 'Guia do Inquilino',
    description: 'Dicas essenciais para locatários',
  },
  'direitos-e-deveres': {
    title: 'Direitos e Deveres',
    description: 'Aspectos legais do aluguel',
  },
  'dicas-praticas': {
    title: 'Dicas Práticas',
    description: 'Sugestões para o dia a dia',
  },
}

// Lista de todos os posts do blog
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

interface CategoryPageProps {
  params: {
    categoria: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categorySlug = params.categoria
  const category = categoryData[categorySlug]

  if (!category) {
    notFound()
  }

  const categoryPosts = blogPosts.filter(
    post => post.category.toLowerCase().replace(/ /g, '-') === categorySlug
  )

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Link 
          href="/blog"
          className="text-purple-800 hover:text-purple-900 mb-8 inline-flex items-center"
        >
          ← Voltar para o Blog
        </Link>

        <h1 className="text-4xl font-bold mb-4">{category.title}</h1>
        <p className="text-xl text-gray-600 mb-12">{category.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryPosts.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              slug={post.slug}
              category={post.category}
            />
          ))}
        </div>

        {categoryPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Nenhum post encontrado nesta categoria ainda.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const categorySlug = params.categoria
  const category = categoryData[categorySlug]

  if (!category) {
    return {
      title: 'Categoria não encontrada',
      description: 'A categoria que você procura não foi encontrada'
    }
  }

  return {
    title: `${category.title} | Blog do Segundo Inquilino`,
    description: `${category.description}. Encontre artigos e dicas sobre ${category.title.toLowerCase()} para aluguel de imóveis.`,
    keywords: `${category.title.toLowerCase()}, aluguel, apartamento, dicas de aluguel, segundo inquilino`,
    robots: 'index, follow',
    openGraph: {
      title: category.title,
      description: category.description,
      type: 'website',
      url: `https://segundoinquilino.com.br/blog/categoria/${categorySlug}`,
      siteName: 'Segundo Inquilino',
    },
    alternates: {
      canonical: `https://segundoinquilino.com.br/blog/categoria/${categorySlug}`
    },
    authors: [{ name: 'Segundo Inquilino' }],
    verification: {
      google: 'seu-código-de-verificação-do-google',
    }
  }
} 