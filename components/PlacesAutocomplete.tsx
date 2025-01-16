'use client'

import { useRef, useEffect } from 'react'
import { useLoadScript } from '@react-google-maps/api'
import type { Libraries } from '@react-google-maps/api'

// Definir libraries como array com um único valor
const libraries: Libraries = ['places']

interface PlacesAutocompleteProps {
  onSelect: (place: {
    address: string
    neighborhood: string
    city: string
    state: string
    postal_code: string
  }) => void
}

interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

export default function PlacesAutocomplete({ onSelect }: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  })

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'br' },
      fields: ['address_components', 'formatted_address']
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.address_components) return

      let address = ''
      let neighborhood = ''
      let city = ''
      let state = ''
      let postal_code = ''

      place.address_components.forEach((component: AddressComponent) => {
        const types = component.types

        if (types.includes('street_number')) {
          address += ' ' + component.long_name
        }
        if (types.includes('route')) {
          address = component.long_name + address
        }
        if (types.includes('sublocality') || types.includes('sublocality_level_1')) {
          neighborhood = component.long_name
        }
        if (types.includes('administrative_area_level_2')) {
          city = component.long_name
        }
        if (types.includes('administrative_area_level_1')) {
          state = component.short_name
        }
        if (types.includes('postal_code')) {
          postal_code = component.long_name
        }
      })

      onSelect({
        address: address.trim(),
        neighborhood,
        city,
        state,
        postal_code
      })
    })

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete)
    }
  }, [isLoaded, onSelect])

  if (!isLoaded) return <div>Carregando...</div>

  return (
    <input
      ref={inputRef}
      type="text"
      className="w-full p-2 border rounded-md"
      placeholder="Digite o endereço do imóvel"
    />
  )
} 