export interface Apartment {
  id: string
  building_name: string
  address: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  property_type: 'house' | 'apartment'
}

export interface Profile {
  avatar_url?: string
  full_name?: string
}

export interface Review {
  id: string
  apartment_id: string
  user_id: string
  rating: number
  comment: string
  content: string | null
  created_at: string
  images: string[]
  amenities: string[]
  pros: string | null
  cons: string | null
  likes_count: number | { count: number }
  profiles?: {
    avatar_url?: string
    full_name?: string
  }
  apartments: Apartment
} 