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
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Comodidades e características
      </label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {AMENITIES.map((amenity) => (
          <label
            key={amenity.id}
            className={`
              flex items-center p-3 rounded-lg border cursor-pointer transition-colors
              ${selectedAmenities.includes(amenity.id)
                ? 'bg-primary-50 border-primary-200 text-primary-700'
                : 'bg-white border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <input
              type="checkbox"
              className="hidden"
              checked={selectedAmenities.includes(amenity.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...selectedAmenities, amenity.id])
                } else {
                  onChange(selectedAmenities.filter(id => id !== amenity.id))
                }
              }}
            />
            <span className="text-sm">{amenity.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
} 