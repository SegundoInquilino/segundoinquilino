import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
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

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <Header currentUserId={user?.id} />
          <main>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
} 