'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Search, Eye, EyeOff, Edit, Trash2, Wrench } from 'lucide-react'
import Link from 'next/link'

interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string
  order: number
  visible: boolean
}

export default function ServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" hizmetini silmek istediğinize emin misiniz?`)) {
      return
    }

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('✅ Hizmet silindi')
        fetchServices()
      } else {
        alert('❌ Hizmet silinemedi')
      }
    } catch (error) {
      console.error('Failed to delete service:', error)
      alert('❌ Bir hata oluştu')
    }
  }

  const visibleCount = services.filter(s => s.visible).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Hizmetler</h1>
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
            const features = JSON.parse(service.features || '[]')
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
                      onClick={() => handleDelete(service.id, service.title)}
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
    </div>
  )
}
