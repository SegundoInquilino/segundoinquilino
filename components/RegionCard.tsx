interface RegionCardProps {
  name: string
  city: string
  state: string
  reviewCount: number
  onClick?: () => void
}

export default function RegionCard({ name, city, state, reviewCount, onClick }: RegionCardProps) {
  return (
    <button
      onClick={onClick}
      className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-left w-full hover:scale-[1.02]"
    >
      <div className="text-sm text-purple-200 mb-1">
        {state}
      </div>
      <h3 className="text-lg font-semibold text-white mb-1">
        {name}
      </h3>
      <div className="text-sm text-purple-100 mb-2">
        {city}
      </div>
      <p className="text-sm text-purple-100">
        {reviewCount} {reviewCount === 1 ? 'review criada' : 'reviews criadas'}
      </p>
    </button>
  )
} 