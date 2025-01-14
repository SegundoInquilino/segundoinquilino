'use client'

import { AMENITIES } from '@/types/amenities'

interface AmenitiesSelectorProps {
  selectedAmenities: string[]
  onChange: (amenities: string[]) => void
}

export const amenitiesOptions = [
  { id: 'silencioso', label: 'Silencioso', icon: '🤫' },
  { id: 'metro_proximo', label: 'Metrô próximo', icon: '🚇' },
  { id: 'mercado_proximo', label: 'Mercado próximo', icon: '🛒' },
  { id: 'estacionamento', label: 'Estacionamento', icon: '🅿️' },
  { id: 'pet_friendly', label: 'Pet friendly', icon: '🐾' },
  { id: 'portaria_24h', label: 'Portaria 24h', icon: '💂' },
  { id: 'academia', label: 'Academia', icon: '💪' },
  { id: 'piscina', label: 'Piscina', icon: '🏊' },
  { id: 'churrasqueira', label: 'Churrasqueira', icon: '🍖' },
  { id: 'playground', label: 'Playground', icon: '🎡' },
  { id: 'salao_festas', label: 'Salão de Festas', icon: '🎉' },
  { id: 'seguranca', label: 'Segurança 24h', icon: '🔒' },
  { id: 'cameras', label: 'Câmeras', icon: '📹' },
  { id: 'delivery_room', label: 'Sala de Delivery', icon: '📦' },
  { id: 'bicicletario', label: 'Bicicletário', icon: '🚲' },
  { id: 'lavanderia', label: 'Lavanderia', icon: '🧺' },
  { id: 'quadra', label: 'Quadra', icon: '🏀' },
  { id: 'coworking', label: 'Coworking', icon: '💻' }
]

export default function AmenitiesSelector({ selectedAmenities, onChange }: AmenitiesSelectorProps) {
  const toggleAmenity = (amenityId: string) => {
    if (selectedAmenities.includes(amenityId)) {
      onChange(selectedAmenities.filter(id => id !== amenityId))
    } else {
      onChange([...selectedAmenities, amenityId])
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 mt-6 mb-4">
        Selecione o que deseja
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {AMENITIES.map((amenity) => {
          const selected = selectedAmenities.includes(amenity.id)
          return (
            <button
              key={amenity.id}
              type="button"
              onClick={() => toggleAmenity(amenity.id)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg border transition-all text-center
                ${selected 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <span className="text-lg">{amenity.icon}</span>
              <span className="text-xs mt-1 line-clamp-1">{amenity.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
} 