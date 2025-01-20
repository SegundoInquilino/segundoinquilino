import { Suspense } from 'react'
import BuildingPageClient from './BuildingPageClient'

interface BuildingPageProps {
  params: Promise<{
    name: string
  }>
}

export default async function BuildingPage({ 
  params 
}: BuildingPageProps) {
  const resolvedParams = await params
  const decodedName = decodeURIComponent(resolvedParams.name)
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    }>
      <BuildingPageClient buildingName={decodedName} />
    </Suspense>
  )
} 