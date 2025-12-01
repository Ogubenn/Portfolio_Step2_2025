'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ExternalLink, Github } from 'lucide-react'

interface ProjectCardProps {
  project: {
    id: string
    slug: string
    title: string
    category: string
    shortDesc: string
    thumbnail: string | null
    technologies: string[] | string  // API'den string veya array gelebilir
    tags: string[] | string
    featured: boolean
    year: number
    demoUrl?: string | null
    githubUrl?: string | null
  }
}

// Safe array parse helper
const ensureArray = (value: string[] | string): string[] => {
  if (Array.isArray(value)) return value
  if (!value) return []
  if (typeof value !== 'string') return []
  
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('JSON Parse Error:', error, 'Value:', value)
    // Fallback strategies
    if (value.includes(',')) {
      return value.split(',').map(s => s.trim()).filter(Boolean)
    }
    return value ? [value] : []
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [showAllTech, setShowAllTech] = useState(false)
  
  // Normalize technologies to array
  const technologies = ensureArray(project.technologies)

  return (
    <article className="card-hover h-full flex flex-col group">
      {/* Project Image */}
      <div className="relative w-full aspect-video bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg overflow-hidden mb-4">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent-electric/20 via-accent-purple/20 to-accent-pink/20 flex items-center justify-center">
            <span className="text-6xl">🖼️</span>
          </div>
        )}
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-accent-electric to-accent-purple text-white text-xs font-semibold rounded-full">
            Öne Çıkan
          </div>
        )}
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-dark-bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-gradient-to-r hover:from-accent-electric hover:to-accent-purple flex items-center justify-center transition-colors"
              aria-label="View demo"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-5 h-5 text-white" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm hover:bg-gradient-to-r hover:from-accent-purple hover:to-accent-pink flex items-center justify-center transition-colors"
              aria-label="View GitHub repository"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-5 h-5 text-white" />
            </a>
          )}
        </div>
      </div>

      {/* Project Content */}
      <div className="flex flex-col flex-grow">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="badge-gradient capitalize">{getCategoryLabel(project.category)}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2 group-hover:text-gradient transition-colors">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-4 line-clamp-3 flex-grow">
          {project.shortDesc}
        </p>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(showAllTech ? technologies : technologies.slice(0, 3)).map((tech, index) => (
            <span
              key={`${tech}-${index}`}
              className="px-2 py-1 bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-secondary dark:text-dark-text-secondary text-xs rounded border border-light-border dark:border-dark-border"
            >
              {tech}
            </span>
          ))}
          {technologies.length > 3 && !showAllTech && (
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowAllTech(true)
              }}
              className="px-2 py-1 bg-gradient-to-r from-accent-electric/20 to-accent-purple/20 hover:from-accent-electric/30 hover:to-accent-purple/30 text-accent-electric dark:text-accent-electric text-xs rounded border border-accent-electric/50 dark:border-accent-electric/50 transition-all duration-200 cursor-pointer font-medium"
            >
              +{technologies.length - 3}
            </button>
          )}
          {showAllTech && technologies.length > 3 && (
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowAllTech(false)
              }}
              className="px-2 py-1 bg-gradient-to-r from-accent-pink/20 to-accent-purple/20 hover:from-accent-pink/30 hover:to-accent-purple/30 text-accent-pink dark:text-accent-pink text-xs rounded border border-accent-pink/50 dark:border-accent-pink/50 transition-all duration-200 cursor-pointer font-medium"
            >
              Daha Az
            </button>
          )}
        </div>

        {/* View Details Link */}
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-2 text-gradient font-medium hover:gap-3 transition-all duration-200 mt-auto"
        >
          Detayları Gör
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  )
}

// Helper function for category labels
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    web: 'Web',
    game: 'Oyun',
    mobile: 'Mobil',
    tool: 'Araç',
    design: 'Tasarım',
  }
  return labels[category] || category
}
