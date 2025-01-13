"use client"
import React from 'react'
import { StarIcon } from '@heroicons/react/24/solid'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'lg'
  editable?: boolean
  onChange?: (rating: number) => void
}

export function StarRating({ 
  rating, 
  size = 'sm', 
  editable = false,
  onChange 
}: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1)

  const handleClick = (star: number) => {
    if (editable && onChange) {
      onChange(star)
    }
  }

  return (
    <div className="flex">
      {stars.map((star) => (
        <button
          key={star}
          onClick={() => handleClick(star)}
          disabled={!editable}
          className={`${editable ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <StarIcon
            className={`${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${
              size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
            }`}
          />
        </button>
      ))}
    </div>
  )
} 