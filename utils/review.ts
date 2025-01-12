import type { Review } from '@/types/review'

export const getReviewTitle = (review: Review) => {
  return review.title || review.content?.split('\n')[0] || 'Sem título'
}

export const getReviewLocation = (review: Review) => {
  const neighborhood = review.apartments?.neighborhood || review.apartment_info?.neighborhood
  const city = review.apartments?.city || review.apartment_info?.city
  return `${neighborhood}, ${city}`
}

export const getReviewAddress = (review: Review) => {
  if (review.apartments?.building_name) {
    return `${review.apartments.building_name} - ${review.apartments.address}`
  }
  return review.apartments?.address || ''
}

export const getReviewAuthor = (review: Review, userMap: Record<string, string>) => {
  return review.profiles?.full_name || userMap[review.user_id] || 'Usuário'
}

export const getReviewSummary = (review: Review, maxLength = 150) => {
  const content = review.content || review.comment || ''
  if (content.length <= maxLength) return content
  return content.slice(0, maxLength).trim() + '...'
}

export const getReviewLikesCount = (review: Review) => {
  if (typeof review.likes_count === 'object') {
    return review.likes_count.count || 0
  }
  return review.likes_count || 0
} 