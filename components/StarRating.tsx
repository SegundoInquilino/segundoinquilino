import { StarIcon } from '@heroicons/react/24/solid'

interface StarRatingProps {
  rating: number
  starSize?: string
}

export default function StarRating({ rating, starSize = 'h-5 w-5' }: StarRatingProps) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`${starSize} ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
} 