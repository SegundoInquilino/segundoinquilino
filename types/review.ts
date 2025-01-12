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

export interface Profile {
  avatar_url?: string
  full_name?: string
}

export interface Review {
  id: string
  rating: number
  comment: string
  content: string
  title: string
  created_at: string
  user_id: string
  likes_count: number
  profiles?: Profile
  apartment_info?: {
    neighborhood?: string
    city?: string
  }
  apartments: Apartment
  amenities?: string[]
} 