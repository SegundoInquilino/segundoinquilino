'use client'

import { forwardRef } from 'react'
import ReactDatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { ptBR } from 'date-fns/locale'

export const DatePicker = forwardRef<any, any>(({ className, ...props }, ref) => {
  return (
    <ReactDatePicker
      locale={ptBR}
      dateFormat="dd/MM/yyyy"
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
      ref={ref}
    />
  )
})

DatePicker.displayName = 'DatePicker' 