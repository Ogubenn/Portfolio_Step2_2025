'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

const categories = ['Tarım Becerileri', 'Ekipman', 'Bilgi', 'Languages', 'Frameworks', 'Tools', 'Other']

interface SkillFormData {
  category: string
  name: string
  level: number
  icon: string
  visible: boolean
}

export default function NewSkillPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<SkillFormData>({
    category: 'Tarım Becerileri',
    name: '',
    level: 80,
    icon: '',
    visible: true,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          level: parseInt(formData.level.toString()),
          icon: formData.icon || null,
        }),
      })

      if (response.ok) {
        alert('✅ Yetenek başarıyla eklendi!')
        router.push('/admin/skills')
        router.refresh()
      } else {
        const data = await response.json()
        alert(`❌ Hata: ${data.error || 'Yetenek eklenemedi'}`)
      }
    } catch (error) {
      console.error('Failed to create skill:', error)
      alert('❌ Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/skills"
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Yeni Yetenek Ekle</h1>
            <p className="text-gray-400">Yeni bir yetenek tanımlayın</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Info */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Temel Bilgiler</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kategori *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Languages: Programlama dilleri | Frameworks: Kütüphaneler | Tools: Araçlar
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Yetenek Adı *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="React, TypeScript, Figma..."
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Icon (Opsiyonel)
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="Lucide icon adı veya URL"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Örn: Code, Database, Settings (Lucide React icon adları)
            </p>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Ayarlar</h2>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="visible"
              name="visible"
              checked={formData.visible}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="visible" className="text-gray-300">
              Sitede görünür olsun
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href="/admin/skills"
            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-center"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </motion.form>
    </div>
  )
}
