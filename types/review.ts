export interface Apartment {
  id: string
  address: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  property_type: 'house' | 'apartment'
}

export interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  images?: string[]
  user_id: string
  apartments: Apartment
  likes_count?: number | { count: number }
} 