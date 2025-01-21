import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Review } from '@/types/review'
import { getReviewAddress } from '@/utils/review'

interface ReviewMapProps {
  reviews: Review[]
  center: {
    lat: number
    lng: number
  }
}

if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
  throw new Error('Google Maps API Key não configurada')
}

const DEFAULT_LAT = -23.5505 // São Paulo
const DEFAULT_LNG = -46.6333

export default function ReviewMap({ reviews, center }: ReviewMapProps) {
  const router = useRouter()
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  
  const defaultCenter = center || {
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG
  }

  const getCoordinates = (review: Review) => ({
    lat: review.apartments?.latitude ?? DEFAULT_LAT,
    lng: review.apartments?.longitude ?? DEFAULT_LNG
  })

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerClassName="w-full h-[600px] rounded-lg"
        center={defaultCenter}
        zoom={13}
      >
        {reviews.map((review) => (
          <Marker
            key={review.id}
            position={getCoordinates(review)}
            onClick={() => setSelectedReview(review)}
          />
        ))}

        {selectedReview && (
          <InfoWindow
            position={getCoordinates(selectedReview)}
            onCloseClick={() => setSelectedReview(null)}
          >
            <div className="p-2">
              <h3 className="font-medium">{selectedReview.apartments.building_name}</h3>
              <p className="text-sm text-gray-600">{getReviewAddress(selectedReview)}</p>
              <div className="mt-2">
                <span className="text-yellow-400">{'★'.repeat(selectedReview.rating)}</span>
              </div>
              <button
                onClick={() => router.push(`/reviews/${selectedReview.id}`)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Ver detalhes
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
} 