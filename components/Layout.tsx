'use client'

import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HomeIcon, StarIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
            <div className="flex flex-col flex-grow">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                <Link
                  href="/home"
                  className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group"
                >
                  <HomeIcon className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500" />
                  Home
                </Link>

                <Link
                  href="/reviews"
                  className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group"
                >
                  <StarIcon className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500" />
                  Reviews
                </Link>

                <Link
                  href="/about"
                  className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group"
                >
                  <InformationCircleIcon className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500" />
                  Sobre
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 