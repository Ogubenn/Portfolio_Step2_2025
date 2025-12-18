'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  GraduationCap,
  Calendar,
  MapPin,
  Award,
} from 'lucide-react'

interface Education {
  id: string
  school: string
  degree: string
  field: string
  startDate: string
  endDate?: string | null
  current: boolean
  gpa?: string | null
  location?: string | null
  visible: boolean
  createdAt: string
}

export default function AdminEducationPage() {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; item: Education | null }>({ 
    isOpen: false, 
    item: null 
  })
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Bulk operations state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      const response = await fetch('/api/education')
      if (response.ok) {
        const data = await response.json()
        setEducation(data)
      }
    } catch (error) {
      console.error('Failed to fetch education:', error)
      toast.error('Eğitim verileri yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'short' 
    })
  }

  const openDeleteDialog = (item: Education) => {
    setDeleteDialog({ isOpen: true, item })
  }

  const closeDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialog({ isOpen: false, item: null })
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.item) return

    setIsDeleting(true)
    const deleteToast = toast.loading('Eğitim kaydı siliniyor...')

    try {
      const response = await fetch(`/api/education/${deleteDialog.item.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEducation(education.filter((e) => e.id !== deleteDialog.item!.id))
        toast.success('Eğitim kaydı başarıyla silindi!', { id: deleteToast })
        closeDeleteDialog()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Eğitim kaydı silinemedi', { id: deleteToast })
      }
    } catch (error) {
      console.error('Failed to delete education:', error)
      toast.error('Bir hata oluştu', { id: deleteToast })
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    const updateToast = toast.loading('Görünürlük güncelleniyor...')
    
    try {
      const response = await fetch(`/api/education/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentVisibility }),
      })

      if (response.ok) {
        const updated = await response.json()
        setEducation(education.map(e => e.id === id ? updated : e))
        toast.success(
          !currentVisibility ? 'Eğitim kaydı gösterilecek' : 'Eğitim kaydı gizlendi',
          { id: updateToast }
        )
      } else {
        toast.error('Görünürlük güncellenemedi', { id: updateToast })
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
      toast.error('Bir hata oluştu', { id: updateToast })
    }
  }

  // Bulk operations
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredEducation.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(filteredEducation.map(e => e.id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return

    setIsBulkDeleting(true)
    const deleteToast = toast.loading(`${selectedItems.size} eğitim kaydı siliniyor...`)

    try {
      const response = await fetch('/api/education/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedItems) }),
      })

      if (response.ok) {
        setEducation(education.filter(e => !selectedItems.has(e.id)))
        setSelectedItems(new Set())
        toast.success(`${selectedItems.size} eğitim kaydı başarıyla silindi!`, { id: deleteToast })
        setBulkDeleteDialog(false)
      } else {
        const data = await response.json()
        toast.error(data.error || 'Kayıtlar silinemedi', { id: deleteToast })
      }
    } catch (error) {
      console.error('Failed to bulk delete:', error)
      toast.error('Bir hata oluştu', { id: deleteToast })
    } finally {
      setIsBulkDeleting(false)
    }
  }

  // Filter & search
  const filteredEducation = education.filter((item) => {
    const matchesSearch = item.school.toLowerCase().includes(search.toLowerCase()) ||
                          item.degree.toLowerCase().includes(search.toLowerCase()) ||
                          item.field.toLowerCase().includes(search.toLowerCase())
    
    if (filter === 'visible') return matchesSearch && item.visible
    if (filter === 'hidden') return matchesSearch && !item.visible
    return matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-400" />
              Eğitim Geçmişi
            </h1>
            <p className="text-gray-400 mt-2">
              {education.length} eğitim kaydı • {education.filter(e => e.visible).length} görünür
            </p>
          </div>
          <Link
            href="/admin/education/new"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Eğitim Ekle
          </Link>
        </div>

        {/* Bulk Actions Bar */}
        {selectedItems.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-between"
          >
            <span className="text-blue-400">
              {selectedItems.size} eğitim kaydı seçildi
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedItems(new Set())}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Seçimi Temizle
              </button>
              <button
                onClick={() => setBulkDeleteDialog(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Toplu Sil
              </button>
            </div>
          </motion.div>
        )}

        {/* Filters & Search */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Okul, derece veya alan ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">Tümü ({education.length})</option>
              <option value="visible">Görünür ({education.filter(e => e.visible).length})</option>
              <option value="hidden">Gizli ({education.filter(e => !e.visible).length})</option>
            </select>
          </div>

          {/* Select All */}
          {filteredEducation.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.size === filteredEducation.length && filteredEducation.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-300">Tümünü Seç</span>
              </label>
            </div>
          )}
        </div>

        {/* Education List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Yükleniyor...</p>
          </div>
        ) : filteredEducation.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <GraduationCap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {search ? 'Eşleşen kayıt bulunamadı' : 'Henüz eğitim kaydı yok'}
            </h3>
            {!search && (
              <p className="text-gray-500 mb-6">
                İlk eğitim kaydınızı ekleyerek başlayın
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredEducation.map((item) => {
              const isSelected = selectedItems.has(item.id)
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gray-800 rounded-lg p-6 border-2 transition-all ${
                    isSelected 
                      ? 'border-blue-500 ring-2 ring-blue-500/30' 
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(item.id)}
                      className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {item.school}
                          </h3>
                          <p className="text-blue-400 font-medium">
                            {item.degree} - {item.field}
                          </p>
                        </div>
                        {item.gpa && (
                          <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium">
                            <Award className="w-3 h-3 inline mr-1" />
                            {item.gpa}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(item.startDate)} - {item.current ? 'Devam Ediyor' : item.endDate ? formatDate(item.endDate) : 'Bilinmiyor'}
                        </div>
                        {item.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {item.location}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleVisibility(item.id, item.visible)}
                          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm transition-colors ${
                            item.visible
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                          }`}
                        >
                          {item.visible ? (
                            <>
                              <Eye className="w-4 h-4" />
                              Görünür
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Gizli
                            </>
                          )}
                        </button>

                        <Link
                          href={`/admin/education/${item.id}`}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 text-sm transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Düzenle
                        </Link>

                        <button
                          onClick={() => openDeleteDialog(item)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-1.5 text-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={closeDeleteDialog}
          onConfirm={handleDelete}
          title="Eğitim Kaydını Sil"
          message={`"${deleteDialog.item?.school} - ${deleteDialog.item?.degree}" kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
          confirmText="Sil"
          cancelText="İptal"
          isLoading={isDeleting}
        />

        {/* Bulk Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={bulkDeleteDialog}
          onClose={() => !isBulkDeleting && setBulkDeleteDialog(false)}
          onConfirm={handleBulkDelete}
          title="Toplu Silme"
          message={`${selectedItems.size} eğitim kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
          confirmText="Tümünü Sil"
          cancelText="İptal"
          isLoading={isBulkDeleting}
        />
      </div>
    </div>
  )
}
