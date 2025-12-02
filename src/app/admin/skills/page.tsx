'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface Skill {
  id: string
  category: string
  name: string
  level: number
  icon: string | null
  order: number
  visible: boolean
  createdAt: string
  updatedAt: string
}

const categories = ['Tarım Becerileri', 'Ekipman', 'Bilgi', 'Languages', 'Frameworks', 'Tools', 'Other']

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; skill: Skill | null }>({ isOpen: false, skill: null })
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchSkills()
  }, [selectedCategory])

  const fetchSkills = async () => {
    try {
      const url = selectedCategory !== 'all' 
        ? `/api/skills?category=${selectedCategory}`
        : '/api/skills'
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setSkills(data)
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const openDeleteDialog = (skill: Skill) => {
    setDeleteDialog({ isOpen: true, skill })
  }

  const closeDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialog({ isOpen: false, skill: null })
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.skill) return

    setIsDeleting(true)
    const deleteToast = toast.loading('Yetenek siliniyor...')

    try {
      const response = await fetch(`/api/skills/${deleteDialog.skill.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSkills(skills.filter(s => s.id !== deleteDialog.skill!.id))
        toast.success('Yetenek başarıyla silindi!', { id: deleteToast })
        closeDeleteDialog()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Yetenek silinemedi', { id: deleteToast })
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Bir hata oluştu', { id: deleteToast })
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleVisibility = async (skill: Skill) => {
    try {
      const response = await fetch(`/api/skills/${skill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...skill, visible: !skill.visible }),
      })

      if (response.ok) {
        const updatedSkill = await response.json()
        setSkills(skills.map(s => s.id === skill.id ? updatedSkill : s))
      }
    } catch (error) {
      console.error('Toggle visibility error:', error)
    }
  }

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedSkills = categories.reduce((acc, category) => {
    acc[category] = filteredSkills.filter(s => s.category === category)
    return acc
  }, {} as Record<string, Skill[]>)

  const totalSkills = skills.length
  const visibleSkills = skills.filter(s => s.visible).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Yetenekler</h1>
          <p className="text-gray-400">
            {totalSkills} yetenek • {visibleSkills} görünür
          </p>
        </div>
        <Link
          href="/admin/skills/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Yetenek
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Yetenek ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Skills by Category */}
      {selectedCategory === 'all' ? (
        <div className="space-y-8">
          {categories.map(category => {
            const categorySkills = groupedSkills[category]
            if (categorySkills.length === 0) return null

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-white mb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map(skill => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      onDelete={openDeleteDialog}
                      onToggleVisibility={toggleVisibility}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map(skill => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onDelete={openDeleteDialog}
              onToggleVisibility={toggleVisibility}
            />
          ))}
        </div>
      )}

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">Yetenek bulunamadı</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDelete}
        title="Yeteneği Sil"
        message={`"${deleteDialog.skill?.name}" yeteneğini kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Evet, Sil"
        cancelText="İptal"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  )
}

interface SkillCardProps {
  skill: Skill
  onDelete: (skill: Skill) => void
  onToggleVisibility: (skill: Skill) => void
}

function SkillCard({ skill, onDelete, onToggleVisibility }: SkillCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 border border-gray-700 rounded-xl p-4 relative group"
    >
      {/* Visibility Badge */}
      {!skill.visible && (
        <div className="absolute top-2 right-2 px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
          Gizli
        </div>
      )}

      <div className="mb-3">
        <h3 className="text-lg font-semibold text-white mb-1">{skill.name}</h3>
        <p className="text-sm text-gray-400">{skill.category}</p>
      </div>

      {/* Level Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Seviye</span>
          <span className="text-xs font-semibold text-blue-400">{skill.level}%</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${skill.level}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleVisibility(skill)}
          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
        >
          {skill.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {skill.visible ? 'Gizle' : 'Göster'}
        </button>
        <Link
          href={`/admin/skills/${skill.id}`}
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </Link>
        <button
          onClick={() => onDelete(skill)}
          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
