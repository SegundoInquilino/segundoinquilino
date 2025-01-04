import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { createClient } from '@/utils/supabase-server'

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
  const supabase = createServerClient()
  
  // Buscar informações do usuário
  const { data: { user } } = await supabase.auth.getUser()
  let username = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
    
    username = profile?.username
  }

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen pt-16">
          <Navbar 
            username={username || undefined} 
            currentUserId={user?.id}
          />
          {children}
        </div>
      </body>
    </html>
  )
} 