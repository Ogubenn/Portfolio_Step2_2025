'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from '@/components/ui/ProjectCard'
import { ChevronDown } from 'lucide-react'

interface Project {
  id: string
  slug: string
  title: string
  category: string
  shortDesc: string
  thumbnail: string | null
  technologies: string[]
  tags: string[]
  featured: boolean
  year: number
  demoUrl?: string | null
  githubUrl?: string | null
}

const categories = [
  { id: 'all', label: 'Tümü' },
  { id: 'web', label: 'Web' },
  { id: 'game', label: 'Oyun' },
  { id: 'mobile', label: 'Mobil' },
  { id: 'tool', label: 'Araçlar' },
]

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [activeCategory])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const url = activeCategory === 'all' 
        ? '/api/public/projects'
        : `/api/public/projects?category=${activeCategory}`
      
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  // Sadece "all" kategorisinde limit uygula
  const displayedProjects =
    activeCategory === 'all' && !showAll
      ? projects.slice(0, 4)
      : projects

  const hasMoreProjects = activeCategory === 'all' && projects.length > 4

  // Kategori sayılarını hesapla
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return projects.length
    return projects.filter(p => p.category === categoryId).length
  }

  return (
    <section id="projects" className="section-padding bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-4">Projeler</h2>
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Çalıştığım ve hayata geçirdiğim projelerden seçkiler
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id)
                setShowAll(false)
              }}
              disabled={loading}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 disabled:opacity-50 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-accent-electric via-accent-purple to-accent-pink text-white shadow-medium'
                  : 'bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary border border-light-border dark:border-dark-border'
              }`}
            >
              {category.label}
              {!loading && (
                <span
                  className={`ml-2 text-sm ${
                    activeCategory === category.id
                      ? 'text-white/80'
                      : 'text-light-text-tertiary dark:text-dark-text-tertiary'
                  }`}
                >
                  ({getCategoryCount(category.id)})
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-wrap justify-center gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)] h-[400px] bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Projects Grid */}
        {!loading && (
          <div className="flex flex-wrap justify-center gap-8">
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(25%-1.5rem)]"
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Show More Button */}
        {hasMoreProjects && !showAll && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mt-12"
          >
            <button
              onClick={() => setShowAll(true)}
              className="group px-8 py-3 rounded-full font-medium bg-gradient-to-r from-accent-electric via-accent-purple to-accent-pink text-white shadow-medium hover:shadow-large transition-all duration-300 flex items-center gap-2"
            >
              Daha Fazla Göster ({projects.length - 4} proje daha)
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && displayedProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-light-text-secondary dark:text-dark-text-secondary">
              Bu kategoride henüz proje bulunmuyor.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
