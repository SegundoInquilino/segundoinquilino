import VisitReviewForm from '@/components/VisitReviewForm'

export default function NewVisitReviewPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Nova Review de Visita
      </h1>
      <VisitReviewForm />
    </div>
  )
} 