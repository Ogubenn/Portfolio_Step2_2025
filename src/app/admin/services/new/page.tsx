'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Plus, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RichTextEditor from '@/components/ui/RichTextEditor'
import { validateServiceForm } from '@/lib/validation'

export default function NewServicePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'Code',
    visible: true
  })
  const [features, setFeatures] = useState<string[]>([''])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const errors = validateServiceForm(formData)
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error.message))
      return
    }

    // Feature kontrolü
    const validFeatures = features.filter(f => f.trim() !== '')
    if (validFeatures.length === 0) {
      toast.error('En az bir özellik eklemelisiniz')
      return
    }

    setSaving(true)
    const saveToast = toast.loading('Hizmet kaydediliyor...')

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: JSON.stringify(validFeatures)
        })
      })

      if (response.ok) {
        toast.success('Hizmet başarıyla eklendi!', { id: saveToast })
        router.push('/admin/services')
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Hizmet eklenemedi', { id: saveToast })
      }
    } catch (error) {
      console.error('Failed to create service:', error)
      toast.error('Bir hata oluştu', { id: saveToast })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const addFeature = () => {
    setFeatures([...features, ''])
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/services"
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Yeni Hizmet</h1>
          <p className="text-gray-400 mt-1">Hizmet ekle</p>
        </div>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-6"
      >
        {/* Title & Icon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Başlık <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Web Development"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              İkon (Lucide React) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              required
              placeholder="Code, Palette, Gamepad2"
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            placeholder="Hizmet açıklaması..."
            minHeight="250px"
          />
        </div>

        {/* Features */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Özellikler
          </label>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder="Özellik açıklaması"
                  className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-red-400" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Özellik Ekle
            </button>
          </div>
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
                <Loader2 className="w-5 h-5 animate-spin" />
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
            href="/admin/services"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            İptal
          </Link>
        </div>
      </motion.form>
    </div>
  )
}
