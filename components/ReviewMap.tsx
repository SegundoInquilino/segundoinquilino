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
  comment?: string
  author?: string
  date?: string
}

interface ReviewMapProps {
  reviews: Review[]
  center?: { lat: number, lng: number }
}

const libraries = ['places', 'geometry']

export default function ReviewMap({ reviews, center }) {
  const router = useRouter()
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  
  const defaultCenter = center || {
    lat: -23.5505, // São Paulo
    lng: -46.6333
  }

  return (
    <LoadScript 
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={libraries as any}
    >
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
            <div className="p-3 max-w-xs">
              <h3 className="font-medium text-lg mb-1">{selectedReview.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedReview.address}</p>
              
              <div className="flex items-center gap-1 mb-2">
                <span className="text-yellow-400">{'★'.repeat(selectedReview.rating)}</span>
                <span className="text-gray-400">{'★'.repeat(5 - selectedReview.rating)}</span>
              </div>

              {selectedReview.comment && (
                <p className="text-sm text-gray-700 mb-2 line-clamp-3">
                  "{selectedReview.comment}"
                </p>
              )}

              <div className="text-xs text-gray-500 mb-3">
                {selectedReview.author && <span>por {selectedReview.author}</span>}
                {selectedReview.date && (
                  <span className="ml-1">
                    • {new Date(selectedReview.date).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>

              <button
                onClick={() => router.push(`/reviews/${selectedReview.id}`)}
                className="w-full text-sm bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Ver review completa
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
} 