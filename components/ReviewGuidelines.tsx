'use client'

import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function ReviewGuidelines() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-purple-50 rounded-xl p-4 mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center">
          <InformationCircleIcon className="h-5 w-5 text-purple-600 mr-2" />
          <span className="text-purple-900">
            Dicas para uma boa avaliação
          </span>
        </div>
        <span className="text-purple-600">
          {isOpen ? 'Ocultar' : 'Ver dicas'}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 text-sm text-purple-800">
          <div>
            <h4 className="font-medium mb-2">📝 Informações Importantes</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Como foi/é sua experiência morando no apartamento?</li>
              <li>O prédio possui acessibilidade? (elevadores, rampas, etc)</li>
              <li>Como é a segurança do local e da região?</li>
              <li>Existem estabelecimentos próximos? (mercados, farmácias, etc)</li>
              <li>Como é o transporte público da região? (metrô, ônibus, etc)</li>
              <li>Como é a qualidade da infraestrutura? (água, luz, internet)</li>
              <li>Existe barulho excessivo? (vizinhos, rua, obras)</li>
              <li>Como é a administração do condomínio?</li>
              <li>Há áreas de lazer? Como é a manutenção?</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-2">💡 Dicas importantes:</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Seja honesto e imparcial em sua avaliação</li>
              <li>Inclua tanto pontos positivos quanto negativos</li>
              <li>Adicione fotos para ilustrar melhor sua experiência</li>
              <li>Evite informações pessoais ou que identifiquem outras pessoas</li>
              <li>Mantenha um tom construtivo e respeitoso</li>
            </ul>
          </div>

          <p className="pt-2 text-purple-600 italic">
            Suas experiências são valiosas para ajudar outros inquilinos!
          </p>
        </div>
      )}
    </div>
  )
} 