'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import RichTextEditor from '@/components/ui/RichTextEditor'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'

export default function NewEducationPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    current: false,
    gpa: '',
    description: '',
    location: '',
    order: 0,
    visible: true,
  })
  const [achievements, setAchievements] = useState<string[]>([])
  const [achievementInput, setAchievementInput] = useState('')

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

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setAchievements([...achievements, achievementInput.trim()])
      setAchievementInput('')
    }
  }

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    // Validation
    if (!formData.school || !formData.degree || !formData.field || !formData.startDate || !formData.description) {
      toast.error('Lütfen tüm zorunlu alanları doldurun')
      setSaving(false)
      return
    }

    try {
      const response = await fetch('/api/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          achievements,
          endDate: formData.current ? null : formData.endDate || null,
          gpa: formData.gpa || null,
          location: formData.location || null,
        }),
      })

      if (response.ok) {
        toast.success('Eğitim kaydı başarıyla oluşturuldu!')
        router.push('/admin/education')
        router.refresh()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Eğitim kaydı oluşturulamadı')
      }
    } catch (error) {
      console.error('Failed to create education:', error)
      toast.error('Bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/education"
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Yeni Eğitim Ekle</h1>
              <p className="text-gray-400 mt-1">Eğitim geçmişinize yeni bir kayıt ekleyin</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Temel Bilgiler</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Okul / Üniversite <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                placeholder="Örn: İstanbul Teknik Üniversitesi"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Derece <span className="text-red-500">*</span>
                </label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="Lisans">Lisans</option>
                  <option value="Ön Lisans">Ön Lisans</option>
                  <option value="Yüksek Lisans">Yüksek Lisans</option>
                  <option value="Doktora">Doktora</option>
                  <option value="Lise">Lise</option>
                  <option value="Sertifika">Sertifika</option>
                  <option value="Bootcamp">Bootcamp</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alan / Bölüm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  placeholder="Örn: Bilgisayar Mühendisliği"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Dates & Location */}
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Tarih & Konum</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Başlangıç Tarihi <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bitiş Tarihi {!formData.current && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="month"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  disabled={formData.current}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  required={!formData.current}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="current"
                  checked={formData.current}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-300">Halen devam ediyor</span>
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Konum
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Örn: İstanbul, Türkiye"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GPA / Not Ortalaması
                </label>
                <input
                  type="text"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleChange}
                  placeholder="Örn: 3.2/4.0 veya 85/100"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Açıklama</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Detaylı Açıklama <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => setFormData({ ...formData, description: value })}
                placeholder="Eğitim süreciniz hakkında detaylı bilgi verin..."
                minHeight="200px"
              />
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Başarılar & Ödüller</h2>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={achievementInput}
                onChange={(e) => setAchievementInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                placeholder="Örn: Onur Öğrencisi, Dekan Listesi"
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={addAchievement}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ekle
              </button>
            </div>

            {achievements.length > 0 && (
              <div className="space-y-2">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                  >
                    <span>{achievement}</span>
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">Ayarlar</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sıralama
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
                <p className="text-sm text-gray-400 mt-1">Küçük sayılar önce gösterilir</p>
              </div>

              <div className="flex items-center pt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="visible"
                    checked={formData.visible}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Ana sayfada göster</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/admin/education"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>
        </form>
      </div>
    </div>
  )
}
