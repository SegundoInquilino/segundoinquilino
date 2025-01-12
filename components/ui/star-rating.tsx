"use client"
import React from 'react'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
}

export function StarRating({ rating, size = 'md' }: StarRatingProps) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={`${
            index < rating ? 'text-yellow-400' : 'text-gray-300'
          } ${size === 'sm' ? 'text-sm' : 'text-base'}`}
        >
          ★
        </span>
      ))}
    </div>
  )
} 