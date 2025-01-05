import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { createClient } from '@/utils/supabase-server'
import { AuthProvider } from '@/contexts/AuthContext'

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
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen pt-16">
            <Navbar />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
} 