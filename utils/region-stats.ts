import { createClient } from '@/utils/supabase-client-server'

export async function getRegionStats() {
  const supabase = createClient()
  
  type ReviewWithApartment = {
    apartments: {
      neighborhood: string
      city: string
      state: string
    }
  }

  const { data } = await supabase
    .from('reviews')
    .select(`
      apartments!inner (
        neighborhood,
        city,
        state
      )
    `)
    .not('apartments.neighborhood', 'is', null)
    .returns<ReviewWithApartment[]>()

  if (!data) return []

  // Agrupa e conta por bairro
  const stats = data.reduce((acc, review) => {
    const { neighborhood, city, state } = review.apartments
    if (neighborhood) {
      const key = `${neighborhood}|${city}|${state}`
      if (!acc[key]) {
        acc[key] = {
          neighborhood,
          city,
          state,
          count: 0
        }
      }
      acc[key].count++
    }
    return acc
  }, {} as Record<string, { neighborhood: string; city: string; state: string; count: number }>)

  // Converte para array e ordena por contagem
  return Object.values(stats)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
} 