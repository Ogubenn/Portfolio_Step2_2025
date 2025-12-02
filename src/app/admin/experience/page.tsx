'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Search, Eye, EyeOff, Edit, Trash2, Briefcase } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string | null
  current: boolean
  description: string
  location: string | null
  type: string | null
  order: number
  visible: boolean
}

export default function ExperiencePage() {
  const router = useRouter()
  const [experiences, setExperiences] = useState<WorkExperience[]>([])
  const [filteredExperiences, setFilteredExperiences] = useState<WorkExperience[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; experience: WorkExperience | null }>({ isOpen: false, experience: null })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchExperiences()
  }, [])

  useEffect(() => {
    filterExperiences()
  }, [searchTerm, experiences])

  const fetchExperiences = async () => {
    try {
      const response = await fetch('/api/experience')
      if (response.ok) {
        const data = await response.json()
        setExperiences(data)
      }
    } catch (error) {
      console.error('Failed to fetch experiences:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterExperiences = () => {
    let filtered = [...experiences]

    if (searchTerm) {
      filtered = filtered.filter(exp =>
        exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredExperiences(filtered)
  }

  const toggleVisibility = async (experience: WorkExperience) => {
    try {
      const response = await fetch(`/api/experience/${experience.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...experience,
          visible: !experience.visible
        })
      })

      if (response.ok) {
        fetchExperiences()
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
    }
  }

  const openDeleteDialog = (experience: WorkExperience) => {
    setDeleteDialog({ isOpen: true, experience })
  }

  const closeDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialog({ isOpen: false, experience: null })
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.experience) return

    setIsDeleting(true)
    const deleteToast = toast.loading('Deneyim siliniyor...')

    try {
      const response = await fetch(`/api/experience/${deleteDialog.experience.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Deneyim başarıyla silindi!', { id: deleteToast })
        closeDeleteDialog()
        fetchExperiences()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Deneyim silinemedi', { id: deleteToast })
      }
    } catch (error) {
      console.error('Failed to delete experience:', error)
      toast.error('Bir hata oluştu', { id: deleteToast })
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'short'
    })
  }

  const calculateDuration = (start: string, end: string | null) => {
    const startDate = new Date(start)
    const endDate = end ? new Date(end) : new Date()
    const months = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (years > 0 && remainingMonths > 0) {
      return `${years} yıl ${remainingMonths} ay`
    } else if (years > 0) {
      return `${years} yıl`
    } else {
      return `${remainingMonths} ay`
    }
  }

  const visibleCount = experiences.filter(e => e.visible).length

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
          <h1 className="text-3xl font-bold text-white">İş Deneyimleri</h1>
          <p className="text-gray-400 mt-1">
            Toplam {experiences.length} deneyim • {visibleCount} görünür
          </p>
        </div>
        <Link
          href="/admin/experience/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Deneyim
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Şirket veya pozisyon ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Experience List */}
      <div className="space-y-4">
        {filteredExperiences.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Deneyim bulunamadı</p>
          </div>
        ) : (
          filteredExperiences.map((experience) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-xl font-bold text-white break-words">
                      {experience.position}
                    </h3>
                    {experience.current && (
                      <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full whitespace-nowrap">
                        Güncel
                      </span>
                    )}
                    {!experience.visible && (
                      <span className="px-2 py-1 text-xs bg-gray-700 text-gray-400 rounded-full whitespace-nowrap">
                        Gizli
                      </span>
                    )}
                  </div>
                  
                  <p className="text-blue-400 font-medium mb-2 break-words">{experience.company}</p>
                  
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
                    <span className="whitespace-nowrap">
                      {formatDate(experience.startDate)} - {experience.current ? 'Devam ediyor' : experience.endDate ? formatDate(experience.endDate) : 'Bilinmiyor'}
                    </span>
                    <span>•</span>
                    <span className="whitespace-nowrap">{calculateDuration(experience.startDate, experience.endDate)}</span>
                    {experience.location && (
                      <>
                        <span>•</span>
                        <span className="break-words">{experience.location}</span>
                      </>
                    )}
                    {experience.type && (
                      <>
                        <span>•</span>
                        <span className="whitespace-nowrap">{experience.type}</span>
                      </>
                    )}
                  </div>
                  
                  <p className="text-gray-300 text-sm line-clamp-2 break-words">
                    {experience.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleVisibility(experience)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    title={experience.visible ? 'Gizle' : 'Göster'}
                  >
                    {experience.visible ? (
                      <Eye className="w-5 h-5 text-gray-400" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <Link
                    href={`/admin/experience/${experience.id}`}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5 text-gray-400" />
                  </Link>
                  <button
                    onClick={() => openDeleteDialog(experience)}
                    className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Deneyimi Sil"
        message={`"${deleteDialog.experience?.position} - ${deleteDialog.experience?.company}" iş deneyimini kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Evet, Sil"
        cancelText="İptal"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  )
}
