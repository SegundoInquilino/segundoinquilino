import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createClient } from '@/utils/supabase-server'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Link from 'next/link'
import { siteMetadata } from '@/lib/metadata'
import SessionAlert from '@/components/SessionAlert'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`
  },
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  openGraph: {
    ...siteMetadata.openGraph,
    images: siteMetadata.openGraph.images
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'seu-código-de-verificação', // Adicione o código do Google Search Console
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  let username = ''
  let profile: { avatar_url?: string } | undefined = undefined

  if (session?.user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', session.user.id)
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
      <head>
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <SessionAlert />
          {session?.user && (
            <Header 
              currentUserId={session.user.id} 
              username={username}
              profile={profile}
            />
          )}
          <main className={session?.user ? 'pt-16' : ''}>
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