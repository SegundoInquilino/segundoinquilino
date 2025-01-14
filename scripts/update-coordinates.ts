import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carrega as variáveis de ambiente
dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getCoordinates(address: string) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    )
    const data = await response.json()
    
    if (data.results && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location
      console.log(`Coordenadas encontradas para ${address}:`, { lat, lng })
      return { latitude: lat, longitude: lng }
    }
    console.log(`Nenhuma coordenada encontrada para ${address}`)
    return null
  } catch (error) {
    console.error(`Erro ao buscar coordenadas para ${address}:`, error)
    return null
  }
}

async function updateCoordinates() {
  // Busca apenas apartamentos sem coordenadas
  const { data: apartments, error } = await supabase
    .from('apartments')
    .select('*')
    .or('latitude.is.null,longitude.is.null')

  if (error) {
    console.error('Erro ao buscar apartamentos:', error)
    return
  }

  console.log(`Encontrados ${apartments.length} apartamentos para atualizar`)

  for (const apartment of apartments) {
    const fullAddress = `${apartment.address}, ${apartment.city}, ${apartment.state}, Brasil`
    console.log(`Processando endereço: ${fullAddress}`)
    
    const coords = await getCoordinates(fullAddress)
    
    if (coords) {
      const { error: updateError } = await supabase
        .from('apartments')
        .update(coords)
        .eq('id', apartment.id)

      if (updateError) {
        console.error(`Erro ao atualizar ${apartment.id}:`, updateError)
      } else {
        console.log(`✅ Atualizado ${apartment.id} com sucesso:`, coords)
      }

      // Aguarda um pouco para não exceder o limite da API
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}

console.log('Iniciando atualização de coordenadas...')
updateCoordinates()
  .then(() => console.log('Processo finalizado'))
  .catch(error => console.error('Erro no processo:', error)) 