import ProfileClient from './ProfileClient'
import { Suspense } from 'react'

// @ts-ignore - ignorando erro de tipagem temporariamente
export default function Page({ params }) {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ProfileClient id={params.id} />
    </Suspense>
  )
} 