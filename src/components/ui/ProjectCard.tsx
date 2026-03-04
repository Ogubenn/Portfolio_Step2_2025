'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ExternalLink, Github, Heart } from 'lucide-react'

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
    likes?: number  // Like sayısı
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

// Strip HTML tags from text
const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  // Remove HTML tags
  const text = html.replace(/<[^>]*>/g, ' ');
  // Clean up multiple spaces and trim
  return text.replace(/\s+/g, ' ').trim();
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [showAllTech, setShowAllTech] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(project.likes || 0)
  const [isLiking, setIsLiking] = useState(false)
  
  // Normalize technologies to array
  const technologies = ensureArray(project.technologies)
  
  // Strip HTML tags from description for clean display
  const cleanDescription = stripHtmlTags(project.shortDesc)

  // Check if project is already liked on mount
  useEffect(() => {
    const likedProjects = JSON.parse(localStorage.getItem('liked_projects') || '[]')
    setLiked(likedProjects.includes(project.id))
  }, [project.id])

  // Handle like button click
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLiking || liked) return

    setIsLiking(true)

    try {
      const response = await fetch(`/api/projects/${project.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setLikeCount(data.likes)
        setLiked(true)

        // Save to localStorage
        const likedProjects = JSON.parse(localStorage.getItem('liked_projects') || '[]')
        likedProjects.push(project.id)
        localStorage.setItem('liked_projects', JSON.stringify(likedProjects))
      }
    } catch (error) {
      console.error('Like error:', error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <article className="card-hover h-full flex flex-col group">
      {/* Project Image */}
      <div className="relative w-full aspect-video bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-lg overflow-hidden mb-4">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
            priority={project.featured}
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
          {cleanDescription}
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

        {/* Like Button */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleLike}
            disabled={liked || isLiking}
            className={`
              inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200
              ${liked 
                ? 'bg-gradient-to-r from-accent-pink/20 to-accent-purple/20 border-accent-pink/50 text-accent-pink cursor-default' 
                : 'bg-light-bg-tertiary dark:bg-dark-bg-tertiary border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary hover:border-accent-pink hover:text-accent-pink hover:bg-accent-pink/10'
              }
              ${isLiking ? 'opacity-50 cursor-wait' : ''}
            `}
            aria-label={liked ? 'Beğenildi' : 'Beğen'}
          >
            <Heart 
              className={`w-4 h-4 transition-all duration-200 ${liked ? 'fill-current' : ''}`}
            />
            <span className="text-sm font-medium">{likeCount}</span>
          </button>

          {/* View Details Link */}
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-2 text-gradient font-medium hover:gap-3 transition-all duration-200"
          >
            Detayları Gör
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
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
