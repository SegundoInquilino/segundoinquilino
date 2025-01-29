'use client'

import useEmblaCarousel from 'embla-carousel-react'
import RegionCard from './RegionCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useState, useCallback, useEffect } from 'react'

interface RegionCarouselProps {
  regions: Array<{
    neighborhood: string
    city: string
    state: string
    count: number
  }>
  onRegionClick: (neighborhood: string) => void
}

export default function RegionCarousel({ regions, onRegionClick }: RegionCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    skipSnaps: false,
    dragFree: true
  })

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(true)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {regions.map((region) => (
            <div className="flex-[0_0_280px]" key={`${region.neighborhood}-${region.city}`}>
              <RegionCard
                name={region.neighborhood}
                city={region.city}
                state={region.state}
                reviewCount={region.count}
                onClick={() => onRegionClick(region.neighborhood)}
              />
            </div>
          ))}
        </div>
      </div>

      {prevBtnEnabled && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
          onClick={scrollPrev}
        >
          <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
        </button>
      )}

      {nextBtnEnabled && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
          onClick={scrollNext}
        >
          <ChevronRightIcon className="w-6 h-6 text-gray-600" />
        </button>
      )}
    </div>
  )
} 