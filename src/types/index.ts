// Project Types
export interface Project {
  id: string
  slug: string
  title: string
  category: ProjectCategory
  shortDescription: string
  fullDescription: string
  role: string
  team: string
  duration: string
  year: string
  technologies: string[]
  tags: string[]
  coverImage: string
  images: string[]
  demoUrl?: string
  githubUrl?: string
  featured: boolean
  problem?: string
  solution?: string
  process?: ProcessStep[]
  results?: Result[]
  learnings?: string[]
}

export type ProjectCategory = 'web' | 'game' | 'mobile' | 'tool' | 'design'

export interface ProcessStep {
  title: string
  description: string
  image?: string
}

export interface Result {
  metric: string
  value: string
  description: string
}

// Skill Types
export interface Skill {
  name: string
  icon?: string
  proficiency?: number // 0-100
}

export interface SkillCategory {
  category: string
  skills: Skill[]
}

// Service Types
export interface Service {
  id: string
  icon: string
  title: string
  description: string
  features: string[]
}

// Contact Form Types
export interface ContactFormData {
  name: string
  email: string
  message: string
  honeypot?: string // spam protection
}

// Social Links
export interface SocialLink {
  platform: string
  url: string
  icon: string
}

// Navigation Types
export interface NavItem {
  label: string
  href: string
}

// SEO/Meta Types
export interface PageMeta {
  title: string
  description: string
  keywords?: string[]
  image?: string
}
