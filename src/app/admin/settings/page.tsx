'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Save, Globe, Mail, Phone, MapPin, Github, Linkedin, Upload, FileText, X } from 'lucide-react'

interface SiteSettings {
  id: number
  heroTitle: string
  heroSubtitle: string
  heroCTA: string | null
  heroImage: string | null
  aboutTitle: string | null
  aboutDescription: string
  aboutBio1: string | null
  aboutBio2: string | null
  aboutBio3: string | null
  aboutImage: string | null
  cvFileUrl: string | null
  testFileUrl: string | null
  contactEmail: string | null
  contactPhone: string | null
  contactLocation: string | null
  socialLinks: string
  siteTitle: string | null
  siteDescription: string | null
  siteKeywords: string | null
  ogImage: string | null
}

interface SocialLinks {
  github?: string
  linkedin?: string
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({})
  const heroImageInputRef = useRef<HTMLInputElement>(null)
  const cvInputRef = useRef<HTMLInputElement>(null)
  const testInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
        setSocialLinks(JSON.parse(data.socialLinks || '{}'))
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File, type: 'cv' | 'test' | 'heroImage') => {
    if (!settings) return

    setUploading(type)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        
        if (type === 'cv') {
          setSettings(prev => prev ? { ...prev, cvFileUrl: data.url } : null)
        } else if (type === 'test') {
          setSettings(prev => prev ? { ...prev, testFileUrl: data.url } : null)
        } else if (type === 'heroImage') {
          setSettings(prev => prev ? { ...prev, heroImage: data.url } : null)
        }
        
        alert(`✅ ${type === 'cv' ? 'CV' : 'Test'} dosyası yüklendi`)
      } else {
        const error = await response.json()
        alert(`❌ ${error.error || 'Dosya yüklenemedi'}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('❌ Bir hata oluştu')
    } finally {
      setUploading(null)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'test' | 'heroImage') => {
    const file = e.target.files?.[0]
    if (file) {
      // Tip kontrolü
      if (type === 'heroImage') {
        if (!file.type.startsWith('image/')) {
          alert('❌ Sadece resim dosyaları yüklenebilir')
          return
        }
        if (file.size > 20 * 1024 * 1024) {
          alert('❌ Resim boyutu 20MB\'dan küçük olmalıdır')
          return
        }
      } else {
        if (file.type !== 'application/pdf') {
          alert('❌ Sadece PDF dosyaları yüklenebilir')
          return
        }
        if (file.size > 50 * 1024 * 1024) {
          alert('❌ Dosya boyutu 50MB\'dan küçük olmalıdır')
          return
        }
      }

      handleFileUpload(file, type)
    }
  }

  const removeFile = (type: 'cv' | 'test' | 'heroImage') => {
    const confirmMsg = type === 'cv' ? 'CV dosyasını' : type === 'test' ? 'Test dosyasını' : 'Hero fotoğrafını'
    if (!confirm(`${confirmMsg} kaldırmak istediğinize emin misiniz?`)) {
      return
    }

    if (type === 'cv') {
      setSettings(prev => prev ? { ...prev, cvFileUrl: null } : null)
    } else if (type === 'test') {
      setSettings(prev => prev ? { ...prev, testFileUrl: null } : null)
    } else if (type === 'heroImage') {
      setSettings(prev => prev ? { ...prev, heroImage: null } : null)
    }
  }

  const clearSection = (section: 'hero' | 'about' | 'contact' | 'social' | 'seo') => {
    if (!confirm(`${section.toUpperCase()} bölümündeki tüm alanları temizlemek istediğinize emin misiniz?`)) {
      return
    }

    setSettings(prev => {
      if (!prev) return null
      
      switch (section) {
        case 'hero':
          return { ...prev, heroTitle: '', heroSubtitle: '', heroCTA: null, heroImage: null }
        case 'about':
          return { ...prev, aboutTitle: null, aboutDescription: '', aboutBio1: null, aboutBio2: null, aboutBio3: null, cvFileUrl: null, testFileUrl: null }
        case 'contact':
          return { ...prev, contactEmail: null, contactPhone: null, contactLocation: null }
        case 'social':
          setSocialLinks({})
          return prev
        case 'seo':
          return { ...prev, siteTitle: null, siteDescription: null, siteKeywords: null, ogImage: null }
        default:
          return prev
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return

    setSaving(true)

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          socialLinks: JSON.stringify(socialLinks)
        })
      })

      if (response.ok) {
        alert('✅ Ayarlar kaydedildi')
      } else {
        alert('❌ Ayarlar kaydedilemedi')
      }
    } catch (error) {
      console.error('Failed to update settings:', error)
      alert('❌ Bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!settings) return
    const { name, value } = e.target
    setSettings(prev => prev ? { ...prev, [name]: value } : null)
  }

  const handleSocialChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }))
  }

  const clearActivityLogs = async () => {
    if (!confirm('⚠️ Tüm aktivite geçmişini silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
      return
    }

    try {
      const response = await fetch('/api/activity/clear', {
        method: 'DELETE'
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ ${data.count} aktivite kaydı silindi`)
      } else {
        alert('❌ Aktivite geçmişi silinemedi')
      }
    } catch (error) {
      console.error('Failed to clear activity logs:', error)
      alert('❌ Bir hata oluştu')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Site Ayarları</h1>
          <p className="text-gray-400 mt-1">Sitenizin genel ayarlarını yönetin</p>
        </div>
        <button
          type="button"
          onClick={clearActivityLogs}
          className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
        >
          <X className="w-5 h-5" />
          Aktivite Geçmişini Sil
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Hero Section
            </h2>
            <button
              type="button"
              onClick={() => clearSection('hero')}
              className="text-sm px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Temizle
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ana Başlık
              </label>
              <input
                type="text"
                name="heroTitle"
                value={settings.heroTitle}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Alt Başlık
              </label>
              <input
                type="text"
                name="heroSubtitle"
                value={settings.heroSubtitle}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                CTA Butonu Metni
              </label>
              <input
                type="text"
                name="heroCTA"
                value={settings.heroCTA || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Hero Profil Fotoğrafı
              </label>
              <input
                ref={heroImageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'heroImage')}
                className="hidden"
              />
              {settings.heroImage ? (
                <div className="space-y-2">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-700">
                    <img
                      src={settings.heroImage}
                      alt="Hero"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => heroImageInputRef.current?.click()}
                      className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                    >
                      Değiştir
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFile('heroImage')}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => heroImageInputRef.current?.click()}
                  disabled={uploading === 'heroImage'}
                  className="w-full px-4 py-2 bg-gray-900 border border-dashed border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors flex items-center justify-center gap-2"
                >
                  {uploading === 'heroImage' ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  {uploading === 'heroImage' ? 'Yükleniyor...' : 'Fotoğraf Yükle'}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Hakkımda Section</h2>
            <button
              type="button"
              onClick={() => clearSection('about')}
              className="text-sm px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Temizle
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Başlık
              </label>
              <input
                type="text"
                name="aboutTitle"
                value={settings.aboutTitle || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Açıklama
              </label>
              <textarea
                name="aboutDescription"
                value={settings.aboutDescription}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Biyografi Paragraf 1
              </label>
              <textarea
                name="aboutBio1"
                value={settings.aboutBio1 || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Örn: Merhaba! Ben Oğulcan, yazılım geliştirme tutkusuyla kod yazan bir yazılımcıyım..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Biyografi Paragraf 2
              </label>
              <textarea
                name="aboutBio2"
                value={settings.aboutBio2 || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Örn: Her projede kaliteli ve kullanıcı dostu çözümler üretmeye odaklanıyorum..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Biyografi Paragraf 3
              </label>
              <textarea
                name="aboutBio3"
                value={settings.aboutBio3 || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Örn: Yeni projeler ve iş birlikleri için her zaman heyecanlıyım..."
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CV Dosyası
                </label>
                <input
                  ref={cvInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'cv')}
                  className="hidden"
                />
                {settings.cvFileUrl ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={settings.cvFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="text-sm truncate">{settings.cvFileUrl.split('/').pop()}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => removeFile('cv')}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => cvInputRef.current?.click()}
                    disabled={uploading === 'cv'}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading === 'cv' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        CV Yükle (PDF)
                      </>
                    )}
                  </button>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Personality Test Dosyası
                </label>
                <input
                  ref={testInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'test')}
                  className="hidden"
                />
                {settings.testFileUrl ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={settings.testFileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="text-sm truncate">{settings.testFileUrl.split('/').pop()}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => removeFile('test')}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => testInputRef.current?.click()}
                    disabled={uploading === 'test'}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading === 'test' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Test Yükle (PDF)
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5" />
              İletişim Bilgileri
            </h2>
            <button
              type="button"
              onClick={() => clearSection('contact')}
              className="text-sm px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Temizle
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                E-posta
              </label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail || ''}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Telefon
              </label>
              <input
                type="text"
                name="contactPhone"
                value={settings.contactPhone || ''}
                onChange={handleChange}
                placeholder="+90 555 555 55 55"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Konum
              </label>
              <input
                type="text"
                name="contactLocation"
                value={settings.contactLocation || ''}
                onChange={handleChange}
                placeholder="İstanbul, Türkiye"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Sosyal Medya Linkleri</h2>
            <button
              type="button"
              onClick={() => clearSection('social')}
              className="text-sm px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Temizle
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </label>
              <input
                type="text"
                value={socialLinks.github || ''}
                onChange={(e) => handleSocialChange('github', e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </label>
              <input
                type="text"
                value={socialLinks.linkedin || ''}
                onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </motion.div>

        {/* SEO Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 border border-gray-700 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">SEO Ayarları</h2>
            <button
              type="button"
              onClick={() => clearSection('seo')}
              className="text-sm px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Temizle
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site Başlığı
              </label>
              <input
                type="text"
                name="siteTitle"
                value={settings.siteTitle || ''}
                onChange={handleChange}
                placeholder="Portfolio - Full-Stack Developer"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site Açıklaması
              </label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Kısa site açıklaması (SEO için)"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Anahtar Kelimeler (virgülle ayırın)
              </label>
              <input
                type="text"
                name="siteKeywords"
                value={settings.siteKeywords || ''}
                onChange={handleChange}
                placeholder="web development, react, nextjs, portfolio"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                OG Image URL
              </label>
              <input
                type="text"
                name="ogImage"
                value={settings.ogImage || ''}
                onChange={handleChange}
                placeholder="/og-image.jpg"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Submit Button */}
        <div className="flex justify-end">
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
        </div>
      </form>
    </div>
  )
}
