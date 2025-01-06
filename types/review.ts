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
  user_id: string
  apartment_id: string
  rating: number
  content: string
  created_at: string
  images?: string[]
  comment?: string
  apartments: {
    id: string
    name: string
    property_type: 'house' | 'apartment'
  }
  likes: {
    count: number
  }
} 