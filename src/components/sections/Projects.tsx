'use client'

import { useState } from 'react'
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
  technologies: string[] | string // API'den JSON string veya array gelebilir
  tags: string[] | string
  featured: boolean
  year: number
  demoUrl?: string | null
  githubUrl?: string | null
}

interface ProjectsProps {
  projects: Project[] | null
}

// Helper function to safely parse JSON fields
const parseJsonField = (field: string[] | string): string[] => {
  if (Array.isArray(field)) return field
  if (!field) return []
  if (typeof field !== 'string') return []
  
  try {
    const parsed = JSON.parse(field)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('JSON Parse Error:', error, 'Field value:', field)
    // Fallback: eğer virgülle ayrılmış string ise split et
    if (field.includes(',')) {
      return field.split(',').map(s => s.trim()).filter(Boolean)
    }
    // Tek bir değerse array yap
    return field ? [field] : []
  }
}

const categories = [
  { id: 'all', label: 'Tümü' },
  { id: 'web', label: 'Web' },
  { id: 'game', label: 'Oyun' },
  { id: 'mobile', label: 'Mobil' },
  { id: 'tool', label: 'Araçlar' },
]

export default function Projects({ projects }: ProjectsProps) {
  const projectsData = projects || []
  const [activeCategory, setActiveCategory] = useState('all')
  const [showAll, setShowAll] = useState(false)

  // Normalize projects data - parse JSON strings
  const normalizedProjects = projectsData.map(project => ({
    ...project,
    technologies: parseJsonField(project.technologies),
    tags: parseJsonField(project.tags)
  }))

  // Filter projects by category
  const filteredProjects = activeCategory === 'all'
    ? normalizedProjects
    : normalizedProjects.filter((p) => p.category === activeCategory)

  // Sadece "all" kategorisinde limit uygula
  const displayedProjects =
    activeCategory === 'all' && !showAll
      ? filteredProjects.slice(0, 4)
      : filteredProjects

  const hasMoreProjects = activeCategory === 'all' && filteredProjects.length > 4

  // Kategori sayılarını hesapla
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return normalizedProjects.length
    return normalizedProjects.filter((p) => p.category === categoryId).length
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
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-accent-electric via-accent-purple to-accent-pink text-white shadow-medium'
                  : 'bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary border border-light-border dark:border-dark-border'
              }`}
            >
              {category.label}
              <span
                className={`ml-2 text-sm ${
                  activeCategory === category.id
                    ? 'text-white/80'
                    : 'text-light-text-tertiary dark:text-dark-text-tertiary'
                }`}
              >
                ({getCategoryCount(category.id)})
              </span>
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
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

        {/* Show More Button */}
        {hasMoreProjects && !showAll && (
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
              Daha Fazla Göster ({filteredProjects.length - 4} proje daha)
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {displayedProjects.length === 0 && (
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
