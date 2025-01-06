import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/utils/supabase-server'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Segundo Inquilino',
  description: 'Avaliações de apartamentos para aluguel',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let username = ''
  let profile = null

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single()
    
    if (data) {
      username = data.username
      profile = {
        avatar_url: data.avatar_url
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