export interface Apartment {
  id: string
  building_name: string
  address: string
  postal_code: string
  neighborhood: string
  city: string
  state: string
  zip_code: string
  property_type?: 'house' | 'apartment'
  latitude?: number
  longitude?: number
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
  rental_source?: string
  lived_from: string | null
  lived_until: string | null
  currently_living: boolean
}

export interface VisitReviewRatings {
  location: number
  condition: number
  rooms: number
  neighborhood: number
  amenities: number
  renovation: number
  cost_benefit: number
}

export type VisitSource = 'imobiliaria' | 'corretor' | 'proprietario' | 'site' | 'outro'

export interface VisitReview extends Review {
  ratings: VisitReviewRatings
  visit_source: VisitSource
  listing_url?: string
  comments?: string
  images?: string[]
  full_address?: string
} 