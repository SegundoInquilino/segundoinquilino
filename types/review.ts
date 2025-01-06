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
  user_id: string
  images?: string[]
  amenities?: string[]
  apartments: {
    id: string
    address: string
    city: string
    state: string
    zip_code: string
    neighborhood: string
    property_type: string
  }
  likes_count: number | { count: number }
} 