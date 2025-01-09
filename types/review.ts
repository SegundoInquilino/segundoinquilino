export interface Apartment {
  id: string
  address: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  property_type: 'house' | 'apartment'
  building_name?: string
}

export interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  user_id: string
  images?: string[]
  amenities?: string[]
  apartments: Apartment
  likes_count: number | { count: number }
} 