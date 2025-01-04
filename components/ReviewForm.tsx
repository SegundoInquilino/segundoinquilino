'use client'

import { useRouter } from 'next/navigation'

const ReviewForm = () => {
  const router = useRouter()
  
  const onSuccess = () => {
    router.push('/home')
  }
  
  // ... resto do código
}

export default ReviewForm 