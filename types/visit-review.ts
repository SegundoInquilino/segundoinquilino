export type VisitReview = {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  property_type: 'apartment' | 'house'
  building_name?: string
  address: string
  comment?: string
  positive_points?: string[]
  negative_points?: string[]
  source: string
  photos?: string[]
  status: 'published' | 'draft' | 'deleted'
} 