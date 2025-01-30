'use client'

import VisitReviewForm from '@/components/VisitReviewForm'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NewVisitReviewPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Botão de voltar */}
      <div className="mb-6">
        <Link
          href="/visit-reviews"
          className="inline-flex items-center text-sm text-gray-500 hover:text-purple-600 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Voltar para reviews de visitas
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Nova Review de Visita
      </h1>

      <VisitReviewForm />
    </div>
  )
} 