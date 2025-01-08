'use client'
import { useState } from 'react'
import ExampleReviewCard from './ExampleReviewCard'

const exampleReviews = [
  {
    initials: "JM",
    name: "João Morador",
    time: "2 anos",
    building: "Residencial Flores",
    location: "São Paulo, SP - Pinheiros",
    review: "Morei neste apartamento por 2 anos e foi uma experiência muito boa. O prédio é bem mantido, a administração é eficiente e os vizinhos são tranquilos. A localização é excelente, próximo ao metrô e com vários serviços na região.",
    pros: ["Ótima localização", "Administração eficiente", "Vizinhança tranquila"],
    cons: ["Barulho da rua", "Elevador às vezes lento", "Garagem apertada"],
    recommends: true
  },
  {
    initials: "MC",
    name: "Maria Costa",
    time: "1 ano e 6 meses",
    building: "Edifício Aurora",
    location: "São Paulo, SP - Vila Mariana",
    review: "Apartamento com ótima estrutura e acabamento de qualidade. O condomínio oferece várias áreas de lazer e a segurança é muito boa. A única ressalva é o valor do condomínio, que é um pouco alto.",
    pros: ["Boa estrutura", "Segurança 24h", "Áreas de lazer"],
    cons: ["Condomínio caro", "Pouco sol", "Vagas pequenas"],
    recommends: true
  },
  {
    initials: "PS",
    name: "Pedro Santos",
    time: "3 anos",
    building: "Residencial Parque Verde",
    location: "São Paulo, SP - Moema",
    review: "Localização privilegiada, próximo a parques e com fácil acesso ao transporte público. O apartamento tem boa ventilação e iluminação natural. A administração é um pouco burocrática mas resolve os problemas.",
    pros: ["Localização nobre", "Boa ventilação", "Área verde"],
    cons: ["Administração lenta", "Portaria antiga", "Barulho de aviões"],
    recommends: true
  },
  {
    initials: "AS",
    name: "Ana Silva",
    time: "1 ano",
    building: "Condomínio Central Park",
    location: "São Paulo, SP - Itaim Bibi",
    review: "Prédio moderno com excelente infraestrutura. Academia bem equipada e área de lazer completa. A localização é perfeita, perto de restaurantes e comércio. O único problema é o barulho da rua nos horários de pico.",
    pros: ["Infraestrutura moderna", "Academia completa", "Localização central"],
    cons: ["Barulho do trânsito", "Piscina pequena", "Elevador lotado"],
    recommends: true
  },
  {
    initials: "RF",
    name: "Rafael Ferreira",
    time: "2 anos e 3 meses",
    building: "Edifício Jardins",
    location: "São Paulo, SP - Perdizes",
    review: "Apartamento bem conservado em um bairro tranquilo e familiar. O prédio tem uma boa administração e os funcionários são muito prestativos. A região tem tudo que precisamos no dia a dia.",
    pros: ["Bairro familiar", "Boa administração", "Funcionários atenciosos"],
    cons: ["Playground antigo", "Interfone com problemas", "Estacionamento limitado"],
    recommends: true
  }
]

export default function ExampleReviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === exampleReviews.length - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? exampleReviews.length - 1 : prevIndex - 1
    )
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {exampleReviews.map((review, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <ExampleReviewCard {...review} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
      >
        <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
      >
        <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="flex justify-center mt-4 gap-2">
        {exampleReviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-purple-800' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
} 