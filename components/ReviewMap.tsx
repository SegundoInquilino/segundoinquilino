import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Review {
  id: string
  latitude: number
  longitude: number
  title: string
  rating: number
  address: string
}

interface ReviewMapProps {
  reviews: Review[]
  center?: { lat: number, lng: number }
}

export default function ReviewMap({ reviews, center }) {
  const router = useRouter()
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  
  const defaultCenter = center || {
    lat: -23.5505, // São Paulo
    lng: -46.6333
  }

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerClassName="w-full h-[600px] rounded-lg"
        center={defaultCenter}
        zoom={13}
      >
        {reviews.map((review) => (
          <Marker
            key={review.id}
            position={{ lat: review.latitude, lng: review.longitude }}
            onClick={() => setSelectedReview(review)}
          />
        ))}

        {selectedReview && (
          <InfoWindow
            position={{ lat: selectedReview.latitude, lng: selectedReview.longitude }}
            onCloseClick={() => setSelectedReview(null)}
          >
            <div className="p-2">
              <h3 className="font-medium">{selectedReview.title}</h3>
              <p className="text-sm text-gray-600">{selectedReview.address}</p>
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