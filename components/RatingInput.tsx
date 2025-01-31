'use client'

import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'

interface RatingInputProps {
  value: number
  onChange: (value: number) => void
}

export default function RatingInput({ value, onChange }: RatingInputProps) {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          type="button"
          onClick={() => onChange(rating)}
          className="p-1 hover:transform hover:scale-110 transition-transform"
        >
          {rating <= value ? (
            <StarIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <StarOutline className="h-6 w-6 text-gray-300" />
          )}
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-500">
        {value > 0 ? value : 'Sem avaliação'}
      </span>
    </div>
  )
} 