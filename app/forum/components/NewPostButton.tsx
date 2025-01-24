'use client'

import { PlusIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import NewPostModal from './NewPostModal'

export default function NewPostButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        <span>Novo Post</span>
      </button>

      <NewPostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
} 