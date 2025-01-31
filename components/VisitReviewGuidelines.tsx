'use client'

import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function VisitReviewGuidelines() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-purple-50 rounded-xl p-4 mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center">
          <InformationCircleIcon className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="font-medium text-purple-900">
            Dicas para uma boa avaliação de visita
          </h3>
        </div>
        <span className="text-purple-600 text-sm">
          {isOpen ? 'Ocultar' : 'Ver dicas'}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 text-sm text-purple-800">
          <div>
            <h4 className="font-medium mb-2">📸 Fotos</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tire fotos bem iluminadas dos ambientes</li>
              <li>Registre detalhes importantes como infiltrações ou acabamentos</li>
              <li>Fotografe a vista das janelas</li>
              <li>Evite fotos com pessoas ou objetos pessoais</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">📝 Comentários</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Seja objetivo e imparcial</li>
              <li>Mencione pontos positivos e negativos</li>
              <li>Descreva aspectos que não aparecem nas fotos (barulhos, cheiros, etc)</li>
              <li>Comente sobre a região e vizinhança</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">⭐ Avaliações</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Avalie cada critério considerando o preço pedido</li>
              <li>Compare com outros imóveis similares que você visitou</li>
              <li>Considere suas necessidades específicas</li>
              <li>Use as descrições de cada critério como guia</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">🏠 Informações do Imóvel</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Confirme o endereço completo</li>
              <li>Inclua o link do anúncio se disponível</li>
              <li>Indique corretamente a fonte da visita</li>
              <li>Mencione se houve alguma divergência com o anúncio</li>
            </ul>
          </div>

          <p className="pt-2 text-purple-600 italic">
            Suas avaliações ajudam outros inquilinos a tomarem melhores decisões!
          </p>
        </div>
      )}
    </div>
  )
} 