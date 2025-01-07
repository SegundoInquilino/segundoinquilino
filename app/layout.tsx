import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/utils/supabase-server'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Link from 'next/link'

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
          
          {/* Footer */}
          <footer className="bg-gray-50 border-t">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <div className="text-center text-sm text-gray-500">
                <Link href="/terms" className="hover:text-gray-600 hover:underline">
                  Termos e Condições
                </Link>
                <span className="mx-2">•</span>
                <span>© {new Date().getFullYear()} Segundo Inquilino</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
} 