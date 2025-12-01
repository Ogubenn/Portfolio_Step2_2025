'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Github, Calendar, Users, Clock, Tag, Home } from 'lucide-react'
import Link from 'next/link'

interface Project {
  id: string
  slug: string
  title: string
  category: string
  description: string
  shortDesc: string
  thumbnail: string | null
  videoUrl?: string | null
  demoUrl?: string | null
  githubUrl?: string | null
  technologies: string[] | string  // API'den string veya array gelebilir
  tags: string[] | string
  year: number
  duration?: string | null
  problem?: string | null
  solution?: string | null
  process?: string | null
  learnings?: string | null
  featured: boolean
  images?: Array<{
    id: string
    url: string
    alt: string | null
    order: number
  }>
}

// Safe array parse helper
const ensureArray = (value: string[] | string | undefined | null): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value !== 'string') return []
  
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('JSON Parse Error in project detail:', error, 'Value:', value)
    // Fallback
    if (value.includes(',')) {
      return value.split(',').map(s => s.trim()).filter(Boolean)
    }
    return value ? [value] : []
  }
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetchProject()
  }, [slug])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/public/projects/${slug}`)
      if (response.ok) {
        const data = await response.json()
        // Normalize data
        data.technologies = ensureArray(data.technologies)
        data.tags = ensureArray(data.tags)
        setProject(data)
      } else {
        setNotFound(true)
      }
    } catch (error) {
      console.error('Failed to fetch project:', error)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-electric border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Yükleniyor...
          </p>
        </div>
      </div>
    )
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-bg-primary dark:bg-dark-bg-primary">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
            Proje Bulunamadı
          </h1>
          <Link href="/#projects" className="btn-primary inline-flex">
            <ArrowLeft className="w-5 h-5" />
            Projelere Dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-light-bg-primary dark:bg-dark-bg-primary relative">
      {/* Floating Back to Projects Button */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="fixed left-6 bottom-6 z-50"
      >
        <Link
          href="/#projects"
          className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-accent-electric to-accent-purple text-white rounded-full shadow-2xl hover:shadow-accent-electric/50 dark:hover:shadow-accent-purple/50 transition-all duration-300 hover:scale-110"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold hidden sm:inline">Projelere Dön</span>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-accent-electric/10 via-accent-purple/10 to-accent-pink/10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Button */}
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-accent-electric dark:hover:text-accent-purple transition-colors mb-8 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Projelere Dön
            </Link>

            {/* Title and Meta */}
            <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
              <div className="flex-1 min-w-0">
                <h1 className="heading-1 mb-4">{project.title}</h1>
                <p className="text-xl text-light-text-secondary dark:text-dark-text-secondary">
                  {project.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex"
                  >
                    <ExternalLink className="w-5 h-5" />
                    Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary inline-flex"
                  >
                    <Github className="w-5 h-5" />
                    GitHub
                  </a>
                )}
              </div>
            </div>

            {/* Project Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card">
                <div className="flex items-center gap-2 text-accent-electric dark:text-accent-purple mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">Yıl</span>
                </div>
                <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                  {project.year}
                </p>
              </div>
              <div className="card">
                <div className="flex items-center gap-2 text-accent-electric dark:text-accent-purple mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium">Süre</span>
                </div>
                <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                  {project.duration || 'Belirtilmemiş'}
                </p>
              </div>
              <div className="card">
                <div className="flex items-center gap-2 text-accent-electric dark:text-accent-purple mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-medium">Takım</span>
                </div>
                <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">
                  Solo Proje
                </p>
              </div>
              <div className="card">
                <div className="flex items-center gap-2 text-accent-electric dark:text-accent-purple mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs font-medium">Kategori</span>
                </div>
                <p className="font-semibold text-light-text-primary dark:text-dark-text-primary capitalize">
                  {project.category === 'web' ? 'Web' : project.category === 'game' ? 'Oyun' : project.category === 'mobile' ? 'Mobil' : 'Araç'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Proje Görselleri & Video */}
      {(project.images && project.images.length > 0) || project.videoUrl ? (
        <section className="section-padding bg-light-bg-secondary dark:bg-dark-bg-secondary">
          <div className="container-custom max-w-5xl">
            {/* Proje Fotoğrafları */}
            {project.images && project.images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
                  Proje Görselleri
                </h2>
                <div className={`grid gap-6 ${project.images.length === 1 ? 'grid-cols-1' : project.images.length === 2 ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
                  {project.images.map((image, index) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative group overflow-hidden rounded-xl"
                    >
                      <img
                        src={image.url}
                        alt={image.alt || `${project.title} - Görsel ${index + 1}`}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Proje Videosu */}
            {project.videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
                  Proje Videosu
                </h2>
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900">
                  <video
                    src={project.videoUrl}
                    controls
                    className="w-full h-full"
                    poster={project.thumbnail || undefined}
                  >
                    Tarayıcınız video oynatmayı desteklemiyor.
                  </video>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      ) : null}

      {/* Content Section */}
      <section className="section-padding">
        <div className="container-custom max-w-5xl">
          {/* Problem */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              🎯 Problem
            </h2>
            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
              {project.problem}
            </p>
          </motion.div>

          {/* Solution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              💡 Çözüm
            </h2>
            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">
              {project.solution}
            </p>
          </motion.div>

          {/* Process */}
          {project.process && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                ⚙️ Süreç
              </h2>
              <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary whitespace-pre-line">
                {project.process}
              </p>
            </motion.div>
          )}

          {/* Learnings */}
          {project.learnings && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
                📚 Öğrendiklerim
              </h2>
              <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary whitespace-pre-line">
                {project.learnings}
              </p>
            </motion.div>
          )}

          {/* Video Player */}
          {project.videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
                🎬 Proje Videosu
              </h2>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-light-border dark:border-dark-border shadow-xl">
                <video
                  controls
                  className="w-full h-full object-cover"
                  src={project.videoUrl}
                >
                  Tarayıcınız video etiketini desteklemiyor.
                </video>
              </div>
            </motion.div>
          )}

          {/* Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
              🛠️ Kullanılan Teknolojiler
            </h2>
            <div className="flex flex-wrap gap-3">
              {ensureArray(project.technologies).map((tech, index) => (
                <motion.span
                  key={`${tech}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="px-4 py-2 bg-gradient-to-r from-accent-electric/20 via-accent-purple/20 to-accent-pink/20 text-light-text-primary dark:text-dark-text-primary rounded-full border border-accent-electric/30 dark:border-accent-purple/30 font-medium transition-all duration-300 hover:scale-105 hover:border-accent-electric/50 dark:hover:border-accent-purple/50 hover:shadow-lg cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Tags */}
          {ensureArray(project.tags).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-6">
                🏷️ Etiketler
              </h2>
              <div className="flex flex-wrap gap-2">
                {ensureArray(project.tags).map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="px-3 py-1 bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-secondary dark:text-dark-text-secondary text-sm rounded-full border border-light-border dark:border-dark-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-accent-electric/10 via-accent-purple/10 to-accent-pink/10">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
              Birlikte Çalışalım
            </h2>
            <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto">
              Benzer bir projeye mi ihtiyacınız var? İletişime geçin ve birlikte harika şeyler yaratalım!
            </p>
            <div className="flex flex-wrap gap-6 justify-center">
              <Link href="/#contact" className="btn-primary inline-flex text-lg px-8 py-4">
                <ExternalLink className="w-6 h-6" />
                İletişime Geç
              </Link>
              <Link href="/#projects" className="btn-secondary inline-flex text-lg px-8 py-4">
                <ArrowLeft className="w-6 h-6" />
                Tüm Projeleri Gör
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
