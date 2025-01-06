interface StarRatingProps {
  rating: number
}

export default function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex items-center">
      <span className="text-yellow-400 text-lg">
        {'★'.repeat(rating)}
      </span>
      <span className="text-gray-300 text-lg">
        {'★'.repeat(5 - rating)}
      </span>
    </div>
  )
} 