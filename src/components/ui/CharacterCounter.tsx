import React from 'react'

interface CharacterCounterProps {
  current: number
  max: number
  className?: string
}

export function CharacterCounter({ current, max, className = '' }: CharacterCounterProps) {
  const percentage = (current / max) * 100
  const isNearLimit = percentage >= 80
  const isOverLimit = current > max

  return (
    <div className={`text-xs ${className}`}>
      <span
        className={`
          ${isOverLimit ? 'text-red-400 font-semibold' : ''}
          ${isNearLimit && !isOverLimit ? 'text-yellow-400' : ''}
          ${!isNearLimit ? 'text-gray-500' : ''}
        `}
      >
        {current} / {max}
      </span>
      {isOverLimit && (
        <span className="ml-2 text-red-400">
          ({current - max} karakter fazla)
        </span>
      )}
    </div>
  )
}

interface TextInputWithCounterProps extends React.InputHTMLAttributes<HTMLInputElement> {
  maxLength?: number  // Optional - sadece göstermek için
  label: string
  required?: boolean
  helperText?: string
}

export function TextInputWithCounter({
  maxLength,
  label,
  required = false,
  helperText,
  value = '',
  ...props
}: TextInputWithCounterProps) {
  const currentLength = String(value).length

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        value={value}
        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex items-center justify-between mt-1">
        {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
      </div>
    </div>
  )
}

interface TextAreaWithCounterProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxLength?: number  // Optional - sadece göstermek için
  label: string
  required?: boolean
  helperText?: string
}

export function TextAreaWithCounter({
  maxLength,
  label,
  required = false,
  helperText,
  value = '',
  rows = 4,
  ...props
}: TextAreaWithCounterProps) {
  const currentLength = String(value).length

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        {...props}
        value={value}
        rows={rows}
        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <div className="flex items-center justify-between mt-1">
        {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
      </div>
    </div>
  )
}
