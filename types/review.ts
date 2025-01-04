export interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  user_id: string
  images?: string[]
  apartments: {
    id: string
    address: string
    city: string
    state: string
    zip_code: string
  }
  likes_count?: { count: number } | number
} 