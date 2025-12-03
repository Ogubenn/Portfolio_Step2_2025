'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Search, Eye, EyeOff, Edit, Trash2, Wrench } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { ServiceCardSkeleton } from '@/components/ui/Skeleton'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string
  order: number
  visible: boolean
}

// Safe JSON parsing helper
const safeParseFeatures = (featuresStr: string): string[] => {
  try {
    const parsed = JSON.parse(featuresStr || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('JSON Parse Error in Admin Services:', error)
    // Fallback: split by comma or newline
    if (featuresStr.includes(',')) {
      return featuresStr.split(',').map(s => s.trim()).filter(Boolean)
    }
    if (featuresStr.includes('\n')) {
      return featuresStr.split('\n').map(s => s.trim()).filter(Boolean)
    }
    return []
  }
}

export default function ServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; service: Service | null }>({ isOpen: false, service: null })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  useEffect(() => {
    filterServices()
  }, [searchTerm, services])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterServices = () => {
    let filtered = [...services]

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredServices(filtered)
  }

  const toggleVisibility = async (service: Service) => {
    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...service,
          visible: !service.visible
        })
      })

      if (response.ok) {
        fetchServices()
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
    }
  }

  const openDeleteDialog = (service: Service) => {
    setDeleteDialog({ isOpen: true, service })
  }

  const closeDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialog({ isOpen: false, service: null })
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.service) return

    setIsDeleting(true)
    const deleteToast = toast.loading('Hizmet siliniyor...')

    try {
      const response = await fetch(`/api/services/${deleteDialog.service.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Hizmet başarıyla silindi!', { id: deleteToast })
        closeDeleteDialog()
        fetchServices()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Hizmet silinemedi', { id: deleteToast })
      }
    } catch (error) {
      console.error('Failed to delete service:', error)
      toast.error('Bir hata oluştu', { id: deleteToast })
    } finally {
      setIsDeleting(false)
    }
  }

  const visibleCount = services.filter(s => s.visible).length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Neler Yapıyorum</h1>
            <p className="text-gray-400 mt-1">Yükleniyor...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Neler Yapıyorum</h1>
          <p className="text-gray-400 mt-1">
            Toplam {services.length} hizmet • {visibleCount} görünür
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Hizmet
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Hizmet ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Services List */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredServices.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <Wrench className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Hizmet bulunamadı</p>
          </div>
        ) : (
          filteredServices.map((service) => {
            const features = safeParseFeatures(service.features)
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-bold text-white break-words">
                        {service.title}
                      </h3>
                      {!service.visible && (
                        <span className="px-2 py-1 text-xs bg-gray-700 text-gray-400 rounded-full whitespace-nowrap">
                          Gizli
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-2 break-words mb-3">
                      {service.description}
                    </p>
                  </div>
                </div>

                {features.length > 0 && (
                  <div className="mb-4">
                    <ul className="space-y-1">
                      {features.slice(0, 3).map((feature: string, idx: number) => (
                        <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">✓</span>
                          <span className="line-clamp-1 break-words">{feature}</span>
                        </li>
                      ))}
                      {features.length > 3 && (
                        <li className="text-xs text-gray-500">
                          +{features.length - 3} özellik daha
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                  <span className="text-xs text-gray-500">Sıra: {service.order}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVisibility(service)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                      title={service.visible ? 'Gizle' : 'Göster'}
                    >
                      {service.visible ? (
                        <Eye className="w-5 h-5 text-gray-400" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5 text-gray-400" />
                    </Link>
                    <button
                      onClick={() => openDeleteDialog(service)}
                      className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Hizmeti Sil"
        message={`"${deleteDialog.service?.title}" hizmetini kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm hizmet verileri silinecektir.`}
        confirmText="Evet, Sil"
        cancelText="İptal"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  )
}
