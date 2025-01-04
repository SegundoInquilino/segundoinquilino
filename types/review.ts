export type PropertyType = 'apartment' | 'house'

export interface Apartment {
  id: string
  address: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  property_type: PropertyType
}

export interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  user_id: string
  likes_count: number | { count: number }
  images?: string[]
  apartment_id: string
  apartments: Apartment
  comments_count?: number
  user_has_liked?: boolean
} 