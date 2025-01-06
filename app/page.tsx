import { redirect } from 'next/navigation'

export default async function Home() {
  // Redireciona diretamente para /reviews
  redirect('/reviews')
} 