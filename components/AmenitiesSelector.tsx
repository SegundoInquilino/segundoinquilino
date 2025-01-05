'use client'

import { AMENITIES } from '@/types/amenities'

interface AmenitiesSelectorProps {
  selectedAmenities: string[]
  onChange: (amenities: string[]) => void
}

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