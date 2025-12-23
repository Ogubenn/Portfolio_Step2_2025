'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { validateSkillForm } from '@/lib/validation'

const categories = ['Programlama Dilleri', 'Framework\'ler', 'Araçlar', 'Diğer']

interface SkillFormData {
  category: string
  name: string
  level: number
  icon: string
  order: number
  visible: boolean
}

export default function EditSkillPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<SkillFormData>({
    category: 'Programlama Dilleri',
    name: '',
    level: 80,
    icon: '',
    order: 0,
    visible: true,
  })

  useEffect(() => {
    fetchSkill()
  }, [params.id])

  const fetchSkill = async () => {
    try {
      const response = await fetch(`/api/skills/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setFormData({
          category: data.category,
          name: data.name,
          level: data.level,
          icon: data.icon || '',
          order: data.order,
          visible: data.visible,
        })
      } else {
        alert('❌ Yetenek yüklenemedi')
        router.push('/admin/skills')
      }
    } catch (error) {
      console.error('Failed to fetch skill:', error)
      alert('❌ Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
    
    // Validate form
    const errors = validateSkillForm(formData)
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error.message))
      return
    }

    setSaving(true)
    const saveToast = toast.loading('Yetenek güncelleniyor...')

    try {
      const response = await fetch(`/api/skills/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          level: parseInt(formData.level.toString()),
          order: parseInt(formData.order.toString()),
          icon: formData.icon || null,
        }),
      })

      if (response.ok) {
        toast.success('Yetenek başarıyla güncellendi!', { id: saveToast })
        router.push('/admin/skills')
        router.refresh()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Yetenek güncellenemedi', { id: saveToast })
      }
    } catch (error) {
      console.error('Failed to update skill:', error)
      toast.error('Bir hata oluştu', { id: saveToast })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`"${formData.name}" yeteneğini silmek istediğinize emin misiniz?`)) {
      return
    }

    try {
      const response = await fetch(`/api/skills/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('✅ Yetenek silindi')
        router.push('/admin/skills')
        router.refresh()
      } else {
        alert('❌ Yetenek silinemedi')
      }
    } catch (error) {
      console.error('Failed to delete skill:', error)
      alert('❌ Bir hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-white">Yeteneği Düzenle</h1>
            <p className="text-gray-400">{formData.name}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Sil
        </button>
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
              Programlama Dilleri: C#, JavaScript, Python | Framework'ler: React, Unity | Araçlar: Git, VS Code
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
            <textarea
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              placeholder="SVG kodu, image URL veya Lucide icon adı"
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              SVG: &lt;svg role="img"...&gt; | URL: https://... veya data:image/... | Icon: Code, Database
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sıralama
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Kategori içindeki gösterim sırası (küçük sayı önce gelir)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Yetenek Seviyesi: {formData.level}%
            </label>
            <input
              type="range"
              name="level"
              min="0"
              max="100"
              step="5"
              value={formData.level}
              onChange={handleChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Başlangıç (0%)</span>
              <span>Orta (50%)</span>
              <span>Uzman (100%)</span>
            </div>
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
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Güncelle
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  )
}
