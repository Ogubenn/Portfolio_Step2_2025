'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ArrowLeft, Save, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { validateProjectForm, generateSlug } from '@/lib/validation'
import { extractYouTubeId, isValidYouTubeUrl, getYouTubeThumbnail, getYouTubeEmbedUrl } from '@/lib/youtube'

interface ProjectFormData {
  slug: string
  title: string
  category: string
  description: string
  shortDesc: string
  thumbnail: string
  videoUrl: string
  demoUrl: string
  githubUrl: string
  technologies: string[]
  tags: string[]
  year: number
  duration: string
  problem: string
  solution: string
  process: string
  learnings: string
  featured: boolean
  published: boolean
}

export default function EditProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [galleryImages, setGalleryImages] = useState<Array<{id: string, url: string}>>([])
  const [formData, setFormData] = useState<ProjectFormData>({
    slug: '',
    title: '',
    category: 'web',
    description: '',
    shortDesc: '',
    thumbnail: '',
    videoUrl: '',
    demoUrl: '',
    githubUrl: '',
    technologies: [],
    tags: [],
    year: new Date().getFullYear(),
    duration: '',
    problem: '',
    solution: '',
    process: '',
    learnings: '',
    featured: false,
    published: true,
  })

  const [techInput, setTechInput] = useState('')
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    fetchProject()
    fetchGalleryImages()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (response.ok) {
        const project = await response.json()
        
        // Safe parse helper
        const parseJsonField = (field: any): string[] => {
          if (Array.isArray(field)) return field
          if (typeof field === 'string') {
            try {
              return JSON.parse(field)
            } catch {
              return []
            }
          }
          return []
        }
        
        setFormData({
          title: project.title || '',
          slug: project.slug || '',
          category: project.category || 'web',
          description: project.description || '',
          shortDesc: project.shortDesc || '',
          thumbnail: project.thumbnail || '',
          videoUrl: project.videoUrl || '',
          demoUrl: project.demoUrl || '',
          githubUrl: project.githubUrl || '',
          technologies: parseJsonField(project.technologies),
          tags: parseJsonField(project.tags),
          year: project.year || new Date().getFullYear(),
          duration: project.duration || '',
          problem: project.problem || '',
          solution: project.solution || '',
          process: project.process || '',
          learnings: project.learnings || '',
          featured: project.featured || false,
          published: project.published !== false,
        })
      } else {
        alert('Proje bulunamadı')
        router.push('/admin/projects')
      }
    } catch (error) {
      console.error('Failed to fetch project:', error)
      alert('Proje yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/images`)
      if (response.ok) {
        const images = await response.json()
        setGalleryImages(images)
      }
    } catch (error) {
      console.error('Failed to fetch gallery images:', error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const addTechnology = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      })
      setTechInput('')
    }
  }

  const removeTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    })
  }

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      })
      setTagInput('')
    }
  }

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    })
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Dosya boyutu kontrolü
    if (file.size > 20 * 1024 * 1024) {
      toast.error('Dosya boyutu 20MB\'dan küçük olmalıdır')
      return
    }

    // Dosya türü kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Sadece resim dosyaları yüklenebilir (jpg, png, webp, gif)')
      return
    }

    setUploading(true)
    const uploadToast = toast.loading('Fotoğraf yükleniyor...')
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('folder', 'portfolio/projects/thumbnails')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setFormData(prev => ({ ...prev, thumbnail: data.url }))
        toast.success('Fotoğraf başarıyla yüklendi!', { id: uploadToast })
      } else {
        toast.error(data.error || 'Yükleme başarısız', { id: uploadToast })
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('❌ Yükleme sırasında bir hata oluştu')
    } finally {
      setUploading(false)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    
    if (!url) {
      setFormData(prev => ({ ...prev, videoUrl: '' }));
      return;
    }

    // YouTube URL validation
    if (!isValidYouTubeUrl(url)) {
      toast.error('Geçersiz YouTube URL. Örnek: https://www.youtube.com/watch?v=VIDEO_ID');
      return;
    }

    const videoId = extractYouTubeId(url);
    if (!videoId) {
      toast.error('YouTube video ID çıkarılamadı');
      return;
    }

    // Convert to embed URL
    const embedUrl = getYouTubeEmbedUrl(videoId);
    setFormData(prev => ({ ...prev, videoUrl: embedUrl }));
    toast.success('YouTube video URL kaydedildi!');
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Maksimum 3 resim kontrolü
    if (galleryImages.length + files.length > 3) {
      alert(`❌ Maksimum 3 proje fotoğrafı yükleyebilirsiniz. Şu an ${galleryImages.length} fotoğrafınız var. ${3 - galleryImages.length} fotoğraf daha ekleyebilirsiniz.`)
      return
    }

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Dosya boyutu kontrolü
        if (file.size > 20 * 1024 * 1024) {
          throw new Error(`${file.name} dosyası 20MB'dan büyük`)
        }

        // Dosya türü kontrolü
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`${file.name} geçersiz format`)
        }

        // Önce dosyayı yükle
        const uploadFormData = new FormData()
        uploadFormData.append('file', file)

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        const uploadData = await uploadResponse.json()

        if (uploadResponse.ok && uploadData.success) {
          // Sonra galeri API'sine kaydet
          const response = await fetch(`/api/projects/${projectId}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              url: uploadData.url,
              alt: `${formData.title} - Görsel`
            }),
          })

          if (response.ok) {
            return await response.json()
          }
        }
        throw new Error(uploadData.error || 'Yükleme başarısız')
      })

      const newImages = await Promise.all(uploadPromises)
      setGalleryImages(prev => [...prev, ...newImages])
      alert(`✅ ${newImages.length} fotoğraf galeriye eklendi!`)
    } catch (error: any) {
      console.error('Gallery upload error:', error)
      alert('❌ ' + error.message)
    } finally {
      setUploading(false)
      // Input'u temizle
      e.target.value = ''
    }
  }

  const removeGalleryImage = async (imageId: string) => {
    if (!confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) return

    try {
      const response = await fetch(`/api/projects/${projectId}/images?imageId=${imageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setGalleryImages(prev => prev.filter(img => img.id !== imageId))
        alert('✅ Fotoğraf silindi!')
      } else {
        alert('❌ Silme başarısız')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('❌ Hata oluştu')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Thumbnail boşsa null olarak gönder
      const submitData = {
        ...formData,
        thumbnail: formData.thumbnail || null,
        videoUrl: formData.videoUrl || null,
        demoUrl: formData.demoUrl || null,
        githubUrl: formData.githubUrl || null,
        duration: formData.duration || null,
        problem: formData.problem || null,
        solution: formData.solution || null,
        process: formData.process || null,
        learnings: formData.learnings || null,
      }

      console.log('Gönderilen veri:', submitData)

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        alert('✅ Proje başarıyla güncellendi!')
        router.push('/admin/projects')
        router.refresh()
      } else {
        const data = await response.json()
        console.error('API Hatası:', data)
        alert(`❌ Hata: ${data.error || 'Proje güncellenemedi'}`)
      }
    } catch (error) {
      console.error('Failed to update project:', error)
      alert('Bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">Proje yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/projects"
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Projeyi Düzenle</h1>
            <p className="text-gray-400">Proje bilgilerini güncelleyin</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Temel Bilgiler</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Proje Başlığı *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Örn: E-Ticaret Platformu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e-ticaret-platformu"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <option value="web">Web</option>
                <option value="game">Oyun</option>
                <option value="mobile">Mobil</option>
                <option value="tool">Araç</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Yıl *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="2000"
                max="2100"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Süre
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3 ay"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Kısa Açıklama *
            </label>
            <textarea
              name="shortDesc"
              value={formData.shortDesc}
              onChange={handleChange}
              required
              rows={2}

              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Kısa bir açıklama (max 200 karakter)"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.shortDesc.length}/200 karakter
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Detaylı Açıklama *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Proje hakkında detaylı bilgi..."
            />
          </div>
        </div>

        {/* Media */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Medya & Linkler</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Thumbnail (Kapak Fotoğrafı)
            </label>
            
            {/* Dosya Yükleme Butonu */}
            <div className="mb-3">
              <label className="relative inline-flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {uploading ? 'Yükleniyor...' : 'Fotoğraf Yükle'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>
              <p className="text-xs text-gray-400 mt-2">
                Max 20MB • JPG, PNG, WebP, GIF
              </p>
            </div>

            {/* URL Input (alternatif) */}
            <input
              type="text"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="veya URL girin: https://example.com/image.jpg"
            />

            {/* Önizleme */}
            {formData.thumbnail && (
              <div className="mt-3 relative h-48 rounded-lg border border-gray-600 overflow-hidden">
                <Image
                  src={formData.thumbnail}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Proje Fotoğrafları (Galeri) */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proje Fotoğrafları (Galeri) - Max 3
            </label>
            
            {/* Galeri Yükleme Butonu */}
            <div className="mb-3">
              <label className={`relative inline-flex items-center gap-2 px-4 py-3 ${galleryImages.length >= 3 ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 cursor-pointer'} text-white rounded-lg transition-colors`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {uploading ? 'Yükleniyor...' : `Fotoğraf Ekle (${galleryImages.length}/3)`}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryUpload}
                  disabled={uploading || galleryImages.length >= 3}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>
              <p className="text-xs text-gray-400 mt-2">
                Max 20MB • JPG, PNG, WebP, GIF • Birden fazla seçebilirsiniz
              </p>
            </div>

            {/* Galeri Önizleme */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {galleryImages.map((image, index) => (
                  <div key={image.id} className="relative group h-32">
                    <Image
                      src={image.url}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover rounded-lg border border-gray-600"
                      sizes="(max-width: 768px) 33vw, 20vw"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(image.id)}
                      className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Proje Videosu (YouTube)
            </label>
            
            {/* YouTube URL Input */}
            <input
              type="text"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleVideoUpload}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500 mb-2"
              placeholder="YouTube URL: https://www.youtube.com/watch?v=..."
            />
            <p className="text-xs text-gray-400 mb-3">
              📺 YouTube'dan video linki yapıştırın (Unlisted videolar desteklenir)
            </p>

            {/* YouTube Video Önizleme */}
            {formData.videoUrl && extractYouTubeId(formData.videoUrl) && (
              <div className="mt-3 space-y-2">
                <p className="text-xs text-green-400">✅ YouTube video algılandı</p>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={formData.videoUrl}
                    className="absolute top-0 left-0 w-full h-full rounded-lg border-2 border-gray-600"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Demo URL
              </label>
              <input
                type="text"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://demo.example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                GitHub URL
              </label>
              <input
                type="text"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>
        </div>

        {/* Technologies & Tags */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Teknolojiler & Etiketler</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Teknolojiler
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Teknoloji ekle (Enter'a bas)"
              />
              <button
                type="button"
                onClick={addTechnology}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Ekle
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg text-sm flex items-center gap-2"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(index)}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Etiketler
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Etiket ekle (Enter'a bas)"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Ekle
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-red-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">İçerik Bölümleri</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Problem
            </label>
            <textarea
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Projenin çözdüğü problem..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Çözüm
            </label>
            <textarea
              name="solution"
              value={formData.solution}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Uygulanan çözüm..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Süreç
            </label>
            <textarea
              name="process"
              value={formData.process}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Geliştirme süreci..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Öğrendiklerim
            </label>
            <textarea
              name="learnings"
              value={formData.learnings}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Projeden öğrenilenler..."
            />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Ayarlar</h2>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-600 bg-gray-900 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-300">Öne Çıkan Proje</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-600 bg-gray-900 text-green-500 focus:ring-2 focus:ring-green-500"
              />
              <span className="text-gray-300">Yayınla</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>

          <Link
            href="/admin/projects"
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            İptal
          </Link>
        </div>
      </form>
    </div>
  )
}
