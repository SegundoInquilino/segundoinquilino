import { useLoadScript, StandaloneSearchBox } from '@react-google-maps/api'
import { useRef } from 'react'

interface PlacesAutocompleteProps {
  onSelect: (address: string, lat: number, lng: number) => void
}

export default function PlacesAutocomplete({ onSelect }: PlacesAutocompleteProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places']
  })

  const searchBox = useRef<google.maps.places.SearchBox>()

  const onPlacesChanged = () => {
    const places = searchBox.current?.getPlaces()
    if (places && places.length > 0) {
      const place = places[0]
      const lat = place.geometry?.location?.lat()
      const lng = place.geometry?.location?.lng()
      
      if (lat && lng) {
        onSelect(place.formatted_address || '', lat, lng)
      }
    }
  }

  if (!isLoaded) return <div>Carregando...</div>

  return (
    <StandaloneSearchBox
      onLoad={ref => searchBox.current = ref}
      onPlacesChanged={onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Buscar endereço..."
        className="w-full p-2 border rounded-md"
      />
    </StandaloneSearchBox>
  )
} 