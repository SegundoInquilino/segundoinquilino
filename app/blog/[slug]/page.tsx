import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface BlogPost {
  title: string
  date: string
  content: string
  category: string
}

type BlogPosts = {
  [key: string]: BlogPost
}

const blogPosts: BlogPosts = {
  'fatores-essenciais-aluguel': {
    title: 'Fatores essenciais para avaliar antes de alugar um apartamento',
    date: '15 de Março, 2024',
    category: 'Guia do Inquilino',
    content: `
      <article class="prose lg:prose-xl">
        <h2>Antes de alugar um apartamento, é essencial verificar:</h2>
        
        <h3>1. Segurança do bairro</h3>
        <ul>
          <li>Pesquise a reputação da área</li>
          <li>Verifique ocorrências de crimes na região</li>
          <li>Observe a iluminação das ruas</li>
          <li>Confira a presença de câmeras e segurança no prédio</li>
        </ul>

        <h3>2. Atividades próximas</h3>
        <ul>
          <li>Mercados e farmácias</li>
          <li>Academias e áreas de lazer</li>
          <li>Transporte público acessível</li>
          <li>Hospitais e postos de saúde</li>
        </ul>

        <h3>3. Qualidade do imóvel</h3>
        <ul>
          <li>Estado dos encanamentos</li>
          <li>Qualidade da pintura</li>
          <li>Manutenção geral do apartamento</li>
          <li>Condições das instalações elétricas</li>
        </ul>

        <h3>4. Histórico de problemas</h3>
        <p>Consulte reviews em sites como segundoinquilino.com.br para saber a experiência de antigos moradores. 
        Informações valiosas sobre:</p>
        <ul>
          <li>Problemas recorrentes</li>
          <li>Qualidade da administração</li>
          <li>Relacionamento com vizinhos</li>
          <li>Custos extras não previstos</li>
        </ul>
      </article>
    `
  },
  'boa-localizacao-apartamento': {
    title: 'Como identificar uma boa localização para seu apartamento',
    date: '14 de Março, 2024',
    category: 'Dicas Práticas',
    content: `
      <article class="prose lg:prose-xl">
        <h2>Avaliando a localização ideal do seu futuro apartamento</h2>
        
        <p>A localização é um dos fatores mais importantes na escolha de um apartamento. 
        Aqui está um guia completo para ajudar você a avaliar se o local é adequado:</p>

        <h3>1. Análise do entorno</h3>
        <ul>
          <li>Proximidade com transporte público</li>
          <li>Facilidade de acesso a comércios essenciais</li>
          <li>Disponibilidade de serviços básicos</li>
          <li>Áreas de lazer nas proximidades</li>
        </ul>

        <h3>2. Tempo de deslocamento</h3>
        <p>Verifique o tempo de deslocamento para:</p>
        <ul>
          <li>Trabalho ou escola</li>
          <li>Principais centros comerciais</li>
          <li>Áreas de interesse frequente</li>
        </ul>

        <h3>3. Segurança da região</h3>
        <p>Pesquise sobre:</p>
        <ul>
          <li>Índices de criminalidade</li>
          <li>Iluminação pública</li>
          <li>Movimento nas ruas em diferentes horários</li>
          <li>Presença de policiamento</li>
        </ul>
      </article>
    `
  },
  'problemas-comuns-aluguel': {
    title: 'Problemas comuns ao alugar um apartamento',
    date: '13 de Março, 2024',
    category: 'Guia do Inquilino',
    content: `
      <article class="prose lg:prose-xl">
        <h2>Problemas mais comuns ao alugar um apartamento e como evitá-los</h2>
        
        <p>Alugar um apartamento pode trazer algumas surpresas desagradáveis se você não estiver preparado. 
        Conheça os problemas mais comuns e saiba como se prevenir:</p>

        <h3>1. Infiltrações e Mofo</h3>
        <p>Um dos problemas mais frequentes em apartamentos alugados:</p>
        <ul>
          <li>Verifique paredes e tetos durante a vistoria inicial</li>
          <li>Observe sinais de umidade ou manchas</li>
          <li>Peça para visitar o imóvel em dia de chuva</li>
          <li>Fotografe e documente qualquer problema existente</li>
        </ul>

        <h3>2. Problemas Elétricos e Hidráulicos</h3>
        <ul>
          <li>Teste todas as tomadas durante a vistoria</li>
          <li>Verifique a pressão da água em todas as torneiras</li>
          <li>Observe o funcionamento do chuveiro</li>
          <li>Confira se há vazamentos aparentes</li>
        </ul>

        <h3>3. Barulho Excessivo</h3>
        <p>O conforto acústico é fundamental para sua qualidade de vida:</p>
        <ul>
          <li>Visite o apartamento em diferentes horários</li>
          <li>Converse com vizinhos sobre o barulho</li>
          <li>Verifique a proximidade com ruas movimentadas</li>
          <li>Observe a qualidade das janelas e isolamento</li>
        </ul>

        <h3>4. Problemas com Vizinhos</h3>
        <p>A boa convivência é essencial:</p>
        <ul>
          <li>Pesquise sobre o perfil dos moradores</li>
          <li>Verifique as regras do condomínio</li>
          <li>Observe a organização dos espaços comuns</li>
          <li>Consulte reviews no segundoinquilino.com.br</li>
        </ul>

        <h3>5. Custos Inesperados</h3>
        <p>Fique atento aos gastos extras:</p>
        <ul>
          <li>Solicite uma previsão dos gastos com condomínio</li>
          <li>Verifique se há taxas extras frequentes</li>
          <li>Confirme os valores de IPTU e outras taxas</li>
          <li>Pergunte sobre histórico de aumentos</li>
        </ul>

        <h3>Como se Prevenir</h3>
        <ol>
          <li>Faça uma vistoria detalhada e documentada</li>
          <li>Leia o contrato com atenção antes de assinar</li>
          <li>Pesquise reviews de antigos moradores</li>
          <li>Fotografe tudo antes de se mudar</li>
          <li>Mantenha toda comunicação por escrito</li>
        </ol>

        <h3>Conclusão</h3>
        <p>A melhor forma de evitar problemas é estar bem informado e preparado. 
        Utilize o segundoinquilino.com.br para pesquisar experiências reais de outros 
        inquilinos e tome decisões mais seguras na hora de alugar seu apartamento.</p>
      </article>
    `
  },
  'avaliar-seguranca-bairro': {
    title: 'Como avaliar a segurança do bairro antes de alugar',
    date: '12 de Março, 2024',
    category: 'Dicas Práticas',
    content: `
      <article class="prose lg:prose-xl">
        <h2>Guia completo para avaliar a segurança de um bairro</h2>
        
        <p>A segurança é um dos fatores mais importantes na escolha de um novo lar. 
        Confira as principais dicas para avaliar se um bairro é seguro antes de alugar:</p>

        <h3>1. Pesquisa Online</h3>
        <ul>
          <li>Consulte estatísticas oficiais de criminalidade da região</li>
          <li>Busque notícias recentes sobre o bairro</li>
          <li>Leia reviews de moradores no segundoinquilino.com.br</li>
          <li>Verifique grupos e fóruns de discussão locais</li>
        </ul>

        <h3>2. Infraestrutura de Segurança</h3>
        <p>Observe a presença de elementos importantes:</p>
        <ul>
          <li>Iluminação pública adequada</li>
          <li>Câmeras de segurança nas ruas</li>
          <li>Presença de postos policiais</li>
          <li>Movimento de viaturas na região</li>
          <li>Guaritas e porteiros em prédios vizinhos</li>
        </ul>

        <h3>3. Visitas em Diferentes Horários</h3>
        <p>É fundamental conhecer o bairro em diferentes momentos:</p>
        <ul>
          <li>Durante o dia para ver o movimento normal</li>
          <li>À noite para avaliar a iluminação</li>
          <li>Nos fins de semana para entender a rotina</li>
          <li>Em horários de pico para ver o fluxo de pessoas</li>
        </ul>

        <h3>4. Conversa com Moradores e Comerciantes</h3>
        <p>Busque informações com quem conhece bem a região:</p>
        <ul>
          <li>Porteiros de prédios vizinhos</li>
          <li>Comerciantes locais</li>
          <li>Moradores que encontrar na rua</li>
          <li>Entregadores e prestadores de serviço</li>
        </ul>

        <h3>5. Análise do Entorno</h3>
        <p>Avalie os estabelecimentos e características da vizinhança:</p>
        <ul>
          <li>Tipo de comércio na região</li>
          <li>Estado de conservação dos imóveis</li>
          <li>Presença de áreas abandonadas</li>
          <li>Proximidade com zonas de risco</li>
        </ul>

        <h3>6. Segurança do Prédio</h3>
        <p>Verifique os sistemas de segurança do edifício:</p>
        <ul>
          <li>Sistema de câmeras de vigilância</li>
          <li>Controle de acesso de visitantes</li>
          <li>Qualificação dos porteiros</li>
          <li>Manutenção das áreas comuns</li>
          <li>Estado dos portões e fechaduras</li>
        </ul>

        <h3>Dicas Adicionais</h3>
        <ol>
          <li>Pesquise o histórico de ocorrências no prédio</li>
          <li>Verifique se há segurança particular na região</li>
          <li>Observe se há câmeras nas ruas principais</li>
          <li>Avalie as rotas de acesso ao transporte público</li>
          <li>Confira a proximidade com delegacias</li>
        </ol>

        <h3>Conclusão</h3>
        <p>A segurança deve ser uma prioridade na escolha do seu novo lar. 
        Combine todas essas análises com as avaliações disponíveis no segundoinquilino.com.br 
        para ter uma visão completa antes de tomar sua decisão. Lembre-se: 
        é melhor investir tempo na pesquisa do que ter problemas depois.</p>

        <div class="bg-purple-50 p-6 rounded-lg mt-8">
          <h4 class="font-semibold mb-2">Dica importante</h4>
          <p>Não se baseie apenas em uma única fonte de informação. 
          Combine diferentes métodos de avaliação e sempre confie em sua intuição. 
          Se algo não parecer seguro, continue procurando outras opções.</p>
        </div>
      </article>
    `
  },
  'mobiliado-vs-sem-mobilia': {
    title: 'Apartamento mobiliado vs. sem mobília: qual escolher?',
    date: '11 de Março, 2024',
    category: 'Direitos e Deveres',
    content: `
      <article class="prose lg:prose-xl">
        <h2>Decidindo entre apartamento mobiliado e sem mobília</h2>
        
        <p>A decisão entre alugar um apartamento mobiliado ou sem mobília pode ser desafiadora. 
        Cada opção tem suas próprias vantagens e desvantagens. Aqui estão algumas considerações para ajudá-lo a tomar a melhor decisão:</p>

        <h3>1. Mobiliado</h3>
        <p>Um apartamento mobiliado é aquele que já vem com móveis pré-instalados. 
        Vantagens:</p>
        <ul>
          <li>Economia de tempo e dinheiro na compra de móveis</li>
          <li>Maior facilidade para se mudar</li>
          <li>Possibilidade de ajustar o ambiente ao seu gosto</li>
        </ul>
        <p>Desvantagens:</p>
        <ul>
          <li>Menor flexibilidade para mudar o ambiente</li>
          <li>Possibilidade de danos ao mobiliário</li>
          <li>Maior custo de manutenção</li>
        </ul>

        <h3>2. Sem Mobília</h3>
        <p>Um apartamento sem mobília é aquele que não vem com móveis pré-instalados. 
        Vantagens:</p>
        <ul>
          <li>Maior flexibilidade para mudar o ambiente</li>
          <li>Menor custo de manutenção</li>
          <li>Possibilidade de escolher os móveis</li>
        </ul>
        <p>Desvantagens:</p>
        <ul>
          <li>Maior tempo e dinheiro investido na compra de móveis</li>
          <li>Menor economia de tempo</li>
        </ul>

        <h3>Considerações Adicionais</h3>
        <p>Além das opções de mobiliado ou sem mobília, considere também outros fatores importantes:</p>
        <ul>
          <li>Localização do apartamento</li>
          <li>Condições de segurança</li>
          <li>Acessibilidade a serviços</li>
          <li>Compatibilidade com seu estilo de vida</li>
        </ul>

        <h3>Conclusão</h3>
        <p>A decisão entre apartamento mobiliado ou sem mobília deve ser baseada em uma combinação de fatores, 
        incluindo suas necessidades específicas, preferências e orçamento. 
        Avalie cuidadosamente cada opção e, se necessário, consulte opiniões de outros inquilinos ou especialistas.</p>
      </article>
    `
  }
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts[params.slug]

  if (!post) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link 
        href="/blog"
        className="text-purple-800 hover:text-purple-900 mb-8 inline-flex items-center"
      >
        ← Voltar para o Blog
      </Link>
      
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-500 mb-8">{post.date}</div>
        <div 
          className="prose lg:prose-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  )
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = blogPosts[params.slug]

  if (!post) {
    return {
      title: 'Post não encontrado',
      description: 'O post que você procura não foi encontrado'
    }
  }

  return {
    title: `${post.title} | Blog do Segundo Inquilino`,
    description: `Leia mais sobre ${post.title} e descubra dicas importantes sobre aluguel de imóveis.`,
    keywords: `${post.category.toLowerCase()}, aluguel, apartamento, ${post.title.toLowerCase()}, segundo inquilino`,
    robots: 'index, follow',
    openGraph: {
      title: post.title,
      description: `Leia mais sobre ${post.title} e descubra dicas importantes sobre aluguel de imóveis.`,
      type: 'article',
      url: `https://segundoinquilino.com.br/blog/${params.slug}`,
      siteName: 'Segundo Inquilino',
      publishedTime: post.date,
      authors: ['Segundo Inquilino'],
      tags: [post.category],
    },
    alternates: {
      canonical: `https://segundoinquilino.com.br/blog/${params.slug}`
    },
    authors: [{ name: 'Segundo Inquilino' }],
    verification: {
      google: 'seu-código-de-verificação-do-google',
    }
  }
} 