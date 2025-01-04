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
      // ... outras tabelas conforme necessário
    }
  }
} 