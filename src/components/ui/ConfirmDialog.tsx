'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { useEffect } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Evet, Sil',
  cancelText = 'İptal',
  isLoading = false,
  variant = 'danger'
}: ConfirmDialogProps) {
  
  // ESC key ile kapat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, isLoading, onClose])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const variantStyles = {
    danger: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      icon: 'text-red-500',
      button: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      icon: 'text-yellow-500',
      button: 'bg-yellow-600 hover:bg-yellow-700'
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      icon: 'text-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700'
    }
  }

  const styles = variantStyles[variant]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => !isLoading && onClose()}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`flex items-start gap-4 p-6 border-b ${styles.border}`}>
                <div className={`w-12 h-12 rounded-lg ${styles.bg} border ${styles.border} flex items-center justify-center flex-shrink-0`}>
                  <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {message}
                  </p>
                </div>

                {!isLoading && (
                  <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                    aria-label="Kapat"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 bg-gray-900/50">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelText}
                </button>
                
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-4 py-2 ${styles.button} text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                >
                  {isLoading && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {isLoading ? 'Siliniyor...' : confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
