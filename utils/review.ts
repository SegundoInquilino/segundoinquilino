import type { Review } from '@/types/review'

export const getReviewTitle = (review: Review) => {
  return review.comment?.split('\n')[0] || review.content?.split('\n')[0] || 'Sem título'
}

export const getReviewLocation = (review: Review) => {
  if (!review.apartments) return 'Localização não disponível'
  return `${review.apartments.neighborhood}, ${review.apartments.city}`
}

export const getReviewAddress = (review: Review) => {
  if (!review.apartments) return 'Endereço não disponível'
  return review.apartments.address
}

export const getReviewAuthor = (review: Review, userMap: Record<string, string>) => {
  return userMap[review.user_id] || review.profiles?.full_name || 'Usuário'
}

export const getReviewSummary = (review: Review) => {
  return review.comment || review.content || 'Sem descrição'
}

export const getReviewLikesCount = (review: Review) => {
  if (typeof review.likes_count === 'object') {
    return review.likes_count.count || 0
  }
  return review.likes_count || 0
} 