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
import LoginBanner from '@/components/LoginBanner'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'
import CookieConsent from '@/components/CookieConsent'
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration'
import { NextRequest, NextResponse } from 'next/server'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

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
    images: [
      {
        url: '/images/Logo_SI_icon.png',
        width: 200,
        height: 200,
        alt: 'Segundo Inquilino Logo'
      }
    ]
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
    google: 'seu-código-de-verificação',
  },
  icons: {
    icon: [
      { url: '/images/si_mobile.png' },
      { url: '/images/si_mobile.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/si_mobile.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/images/si_mobile.png' },
    ],
    shortcut: [
      { url: '/images/si_mobile.png' }
    ],
  },
  manifest: '/site.webmanifest',
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Adicionar middleware para cookies
export const middleware = async (request: NextRequest) => {
  const response = NextResponse.next()
  await Promise.resolve() // Garante que os cookies sejam processados
  return response
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
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6B46C1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Segundo Inquilino" />
        <meta name="apple-mobile-web-app-title" content="Segundo Inquilino" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="msapplication-starturl" content="/" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/web-app-manifest-192x192.png" type="image/png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/web-app-manifest-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/web-app-manifest-512x512.png" />
        <link rel="apple-touch-icon" href="/web-app-manifest-192x192.png" />
        <link rel="apple-touch-startup-image" href="/web-app-manifest-192x192.png" />
        <script 
          src="https://www.google.com/recaptcha/enterprise.js" 
          async 
          defer
        ></script>
      </head>
      <body className={inter.className}>
        <ServiceWorkerRegistration />
        <AuthProvider>
          <SessionAlert />
          <LoginBanner show={!session?.user} />
          {session?.user ? (
            <Header 
              currentUserId={session.user.id} 
              username={username}
              profile={profile}
            />
          ) : (
            <div className="h-8" />
          )}
          <main className="pt-16">
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
          
          {/* Adicionar o banner de cookies */}
          <CookieConsent />
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
} 