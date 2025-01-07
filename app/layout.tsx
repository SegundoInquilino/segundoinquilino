import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/utils/supabase-server'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Segundo Inquilino',
  description: 'Avaliações e reviews de apartamentos e casas para alugar',
  openGraph: {
    title: 'Segundo Inquilino',
    description: 'Avaliações e reviews de apartamentos e casas para alugar',
    url: 'https://segundoinquilino.com.br',
    siteName: 'Segundo Inquilino',
    images: [
      {
        url: '/images/Logo_SI_icon_160x160.png',
        width: 160,
        height: 160,
        alt: 'Segundo Inquilino Logo',
      }
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  icons: {
    icon: '/images/Logo_SI_icon_160x160.png',
    apple: '/images/Logo_SI_icon_160x160.png',
  },
  twitter: {
    card: 'summary',
    title: 'Segundo Inquilino',
    description: 'Avaliações e reviews de apartamentos e casas para alugar',
    images: ['/images/Logo_SI_icon_160x160.png'],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let username = ''
  let profile: { avatar_url?: string } | undefined = undefined

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single()
    
    if (data) {
      username = data.username
      profile = {
        avatar_url: data.avatar_url || undefined
      }
    }
  }

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <Header 
            currentUserId={user?.id} 
            username={username}
            profile={profile}
          />
          <main className={user ? 'pt-16' : ''}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
} 