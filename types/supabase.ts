export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      reviews: {
        Row: {
          id: string
          rating: number
          comment: string
          created_at: string
          user_id: string
          images?: string[]
          apartment_id: string
        }
      }
      review_requests: {
        Row: {
          id: string
          building_name: string
          address: string
          requester_id: string
          status: 'pending' | 'completed' | 'rejected'
          created_at: string
          notes?: string
          lat?: number
          lng?: number
        }
      }
      // ... outras tabelas conforme necessário
    }
  }
}

export type ReviewRequest = {
  id: string
  building_name: string
  address: string
  email: string
  zip_code: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  notes: string | null
  status: 'pending' | 'completed' | 'rejected'
  created_at: string
} 