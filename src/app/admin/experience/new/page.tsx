'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Briefcase } from 'lucide-react'
import Link from 'next/link'
import RichTextEditor from '@/components/ui/RichTextEditor'

export default function NewExperiencePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    location: '',
    type: 'Full-time',
    visible: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          endDate: formData.current ? null : formData.endDate || null,
          location: formData.location || null,
          type: formData.type || null
        })
      })

      if (response.ok) {
        alert('✅ Deneyim eklendi')
        router.push('/admin/experience')
      } else {
        const error = await response.json()
        alert(`❌ Hata: ${error.error || 'Deneyim eklenemedi'}`)
      }
    } catch (error) {
      console.error('Failed to create experience:', error)
      alert('❌ Bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        // Eğer "current" checkbox'ı işaretlenirse, endDate'i temizle
        ...(name === 'current' && checked ? { endDate: '' } : {})
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/experience"
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Yeni Deneyim</h1>
          <p className="text-gray-400 mt-1">İş deneyimi ekle</p>
        </div>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6"
      >
        {/* Company & Position */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Şirket <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="Şirket adı"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Pozisyon <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              placeholder="İş pozisyonu"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Location & Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Konum
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Şehir, Ülke"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Çalışma Tipi
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Full-time">Tam zamanlı</option>
              <option value="Part-time">Yarı zamanlı</option>
              <option value="Freelance">Freelance</option>
              <option value="Contract">Sözleşmeli</option>
              <option value="Internship">Staj</option>
            </select>
          </div>
        </div>

        {/* Start Date, End Date, Current */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Başlangıç <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bitiş {!formData.current && <span className="text-red-500">*</span>}
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required={!formData.current}
              disabled={formData.current}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors w-full">
              <input
                type="checkbox"
                name="current"
                checked={formData.current}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-700 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">Devam ediyor</span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Açıklama <span className="text-red-500">*</span>
          </label>
          <RichTextEditor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value })}
            placeholder="İş tanımı, sorumluluklar, başarılar..."
            minHeight="300px"
          />
        </div>

        {/* Visibility */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="visible"
              checked={formData.visible}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-700 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">Sitede göster</span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Kaydet
              </>
            )}
          </button>
          <Link
            href="/admin/experience"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            İptal
          </Link>
        </div>
      </motion.form>
    </div>
  )
}
