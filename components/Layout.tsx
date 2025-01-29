'use client'

import { ReactNode } from 'react'
import Image from 'next/image'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Image
        src="/images/Logo_SI.png?v=2"
        alt="Segundo Inquilino Logo"
        width={300}
        height={300}
        className="h-auto w-auto"
        priority
      />
      {children}
    </div>
  )
} 