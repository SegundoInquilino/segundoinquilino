import Image from 'next/image'

interface ExampleReviewProps {
  initials: string
  name: string
  time: string
  building: string
  location: string
  review: string
  pros: string[]
  cons: string[]
  recommends: boolean
}

export default function ExampleReviewCard({
  initials,
  name,
  time,
  building,
  location,
  review,
  pros,
  cons,
  recommends
}: ExampleReviewProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-800 font-semibold">{initials}</span>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-semibold text-gray-900">{name}</h4>
            <p className="text-sm text-gray-500">Morou por {time}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <h3 className="text-xl font-bold text-gray-900">{building}</h3>
            {recommends && (
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Recomenda
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{location}</p>
        </div>

        <div className="space-y-3">
          <p className="text-gray-700">{review}</p>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Pontos Positivos</p>
              <ul className="mt-1 text-sm text-gray-600">
                {pros.map((pro, index) => (
                  <li key={index}>• {pro}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Pontos Negativos</p>
              <ul className="mt-1 text-sm text-gray-600">
                {cons.map((con, index) => (
                  <li key={index}>• {con}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 