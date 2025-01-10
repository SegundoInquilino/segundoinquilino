interface StarRatingProps {
  rating: number
  size?: 'small' | 'medium' | 'large'
}

export default function StarRating({ rating, size = 'medium' }: StarRatingProps) {
  const starSize = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }[size]

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