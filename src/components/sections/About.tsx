'use client'

import { motion } from 'framer-motion'
import { Download, Code, Palette, Gamepad2, Database, FileText } from 'lucide-react'
import { trackCVDownload } from '@/lib/analytics'

interface Skill {
  id: number
  category: string
  name: string
  level: number
  icon: string | null
  order: number
  visible: boolean
}

interface GroupedSkills {
  [category: string]: Skill[]
}

interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string | null
  current: boolean
  description: string
  location: string | null
  type: string | null
}

interface SiteSettings {
  aboutTitle: string | null
  aboutDescription: string | null
  aboutBio1: string | null
  aboutBio2: string | null
  aboutBio3: string | null
  workApproach: string | null  // JSON array
  cvFileUrl: string | null
  testFileUrl: string | null
}

interface AboutProps {
  settings: SiteSettings | null
  skills: Skill[] | null
  experience: WorkExperience[] | null
}

const categoryIcons: { [key: string]: any } = {
  Languages: Code,
  Frameworks: Palette,
  Tools: Database,
  Other: Gamepad2,
}

const defaultSettings: SiteSettings = {
  aboutTitle: null,
  aboutDescription: null,
  aboutBio1: null,
  aboutBio2: null,
  aboutBio3: null,
  workApproach: null,
  cvFileUrl: null,
  testFileUrl: null
}

const defaultWorkApproach = [
  'Agile/Scrum metodolojisi ile çalışma',
  'Test-driven development (TDD) yaklaşımı',
  'Sürekli öğrenme ve kendini geliştirme',
  'Clean code ve best practices\'e önem'
]

export default function About({ settings, skills, experience }: AboutProps) {
  const data = settings || defaultSettings
  const skillsData = skills || []
  const experienceData = experience || []

  // Parse work approach items
  let workApproachItems: string[] = defaultWorkApproach
  try {
    if (data.workApproach) {
      workApproachItems = JSON.parse(data.workApproach)
    }
  } catch {
    workApproachItems = defaultWorkApproach
  }

  // Group skills by category
  const groupedSkills = skillsData.reduce((acc: GroupedSkills, skill: Skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {})

  // Sort by level (highest first) and take top 6 for level display
  const skillLevels = [...skillsData].sort((a, b) => b.level - a.level).slice(0, 6)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', { 
      year: 'numeric', 
      month: 'short'
    })
  }

  return (
    <section id="about" className="section-padding bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-4">{data.aboutTitle || 'Hakkımda'}</h2>
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            {data.aboutDescription || 'Tutkuyla kod yazan, detaylara önem veren bir geliştirici'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-4">
              {data.aboutBio1 && (
                <div 
                  dangerouslySetInnerHTML={{ __html: data.aboutBio1 }} 
                  className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-blue-400"
                />
              )}
              {data.aboutBio2 && (
                <div 
                  dangerouslySetInnerHTML={{ __html: data.aboutBio2 }} 
                  className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-blue-400"
                />
              )}
              {data.aboutBio3 && (
                <div 
                  dangerouslySetInnerHTML={{ __html: data.aboutBio3 }} 
                  className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-blue-400"
                />
              )}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap gap-4 mt-8">
              {data.cvFileUrl && (
                <a
                  href={`/api/download?url=${encodeURIComponent(data.cvFileUrl)}&filename=CV-Ogulcan-Gunes.pdf`}
                  onClick={() => trackCVDownload()}
                  className="btn-primary inline-flex group"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  CV İndir
                </a>
              )}
              {data.testFileUrl && (
                <a
                  href={`/api/download?url=${encodeURIComponent(data.testFileUrl)}&filename=Personality-Test-Ogulcan-Gunes.pdf`}
                  className="btn-secondary inline-flex group"
                >
                  <FileText className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  Personality Test İndir
                </a>
              )}
            </div>
          </motion.div>

          {/* Right Column - Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Skills by Category */}
            <div className="grid gap-4 mb-6">
              {Object.entries(groupedSkills).map(([category, items], index) => {
                const Icon = categoryIcons[category] || Code
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="card"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-electric/20 via-accent-purple/20 to-accent-pink/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-accent-electric" />
                      </div>
                      <h3 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary">
                        {category}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {items.map((skill) => (
                        <span
                          key={skill.id}
                          className="px-4 py-2 text-sm font-medium bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary rounded-lg border border-light-border dark:border-dark-border hover:border-accent-electric dark:hover:border-accent-purple hover:scale-105 transition-all duration-200 cursor-default shadow-sm"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-5 bg-gradient-to-br from-accent-electric/5 via-accent-purple/5 to-accent-pink/5 rounded-xl border border-light-border dark:border-dark-border"
            >
              <h4 className="text-sm font-semibold text-light-text-primary dark:text-dark-text-primary mb-3">
                Çalışma Yaklaşımım
              </h4>
              <ul className="space-y-2 text-xs text-light-text-primary dark:text-dark-text-primary">
                {workApproachItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className={`mt-0.5 ${
                      index % 3 === 0 ? 'text-accent-electric' : 
                      index % 3 === 1 ? 'text-accent-purple' : 
                      'text-accent-pink'
                    }`}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>

        {/* Skill Levels Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-8 text-center">
            Yetenek Seviyeleri
          </h3>
          {skillLevels.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {skillLevels.map((skill, index) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="space-y-2 p-4 rounded-lg border border-light-border dark:border-dark-border bg-light-bg-secondary dark:bg-dark-bg-secondary transition-all duration-300 hover:scale-105 hover:border-accent-electric/50 dark:hover:border-accent-purple/50 hover:shadow-xl"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-light-text-primary dark:text-dark-text-primary">
                      {skill.name}
                    </span>
                    <span className="text-sm font-semibold text-gradient">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-accent-electric via-accent-purple to-accent-pink rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Work Experience Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-light-text-primary dark:text-dark-text-primary mb-8 text-center">
            Çalıştığım Yerler
          </h3>
          <div className="max-w-3xl mx-auto space-y-6">
            {experienceData.length === 0 ? (
              <p className="text-center text-light-text-secondary dark:text-dark-text-secondary">
                Henüz iş deneyimi eklenmedi.
              </p>
            ) : (
              experienceData.map((work, index) => (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-hover flex flex-col md:flex-row gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
                        {work.position}
                      </h4>
                      {work.current && (
                        <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full whitespace-nowrap">
                          Güncel
                        </span>
                      )}
                    </div>
                    <p className="text-accent-electric dark:text-accent-purple font-medium mb-2">
                      {work.company}
                      {work.location && (
                        <span className="text-light-text-secondary dark:text-dark-text-secondary text-sm ml-2">
                          • {work.location}
                        </span>
                      )}
                    </p>
                    <div 
                      className="prose prose-sm prose-invert max-w-none text-sm text-light-text-secondary dark:text-dark-text-secondary line-clamp-3"
                      dangerouslySetInnerHTML={{ __html: work.description }}
                    />
                  </div>
                  <div className="md:text-right flex-shrink-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-accent-electric/20 via-accent-purple/20 to-accent-pink/20 text-light-text-primary dark:text-dark-text-primary border border-accent-electric/30 dark:border-accent-purple/30 whitespace-nowrap">
                      {formatDate(work.startDate)} - {work.current ? 'Devam ediyor' : work.endDate ? formatDate(work.endDate) : 'Bilinmiyor'}
                    </span>
                    {work.type && (
                      <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary mt-1">
                        {work.type}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
