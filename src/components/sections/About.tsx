'use client'

import { motion } from 'framer-motion'
import { Download, Code, Palette, Gamepad2, Database, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'

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
  cvFileUrl: string | null
  testFileUrl: string | null
}

const categoryIcons: { [key: string]: any } = {
  Languages: Code,
  Frameworks: Palette,
  Tools: Database,
  Other: Gamepad2,
}

export default function About() {
  const [skills, setSkills] = useState<GroupedSkills>({})
  const [skillLevels, setSkillLevels] = useState<Skill[]>([])
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([])
  const [settings, setSettings] = useState<SiteSettings>({ aboutTitle: null, aboutDescription: null, aboutBio1: null, aboutBio2: null, aboutBio3: null, cvFileUrl: null, testFileUrl: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSkills()
    fetchWorkExperience()
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/public/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({
          aboutTitle: data.aboutTitle,
          aboutDescription: data.aboutDescription,
          aboutBio1: data.aboutBio1,
          aboutBio2: data.aboutBio2,
          aboutBio3: data.aboutBio3,
          cvFileUrl: data.cvFileUrl,
          testFileUrl: data.testFileUrl
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const fetchSkills = async () => {
    try {
      const response = await fetch('/api/public/skills')
      if (response.ok) {
        const data: Skill[] = await response.json()
        
        // Group skills by category
        const grouped = data.reduce((acc: GroupedSkills, skill: Skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = []
          }
          acc[skill.category].push(skill)
          return acc
        }, {})
        
        setSkills(grouped)
        
        // Sort by level (highest first) and take top 6 for level display
        const topSkills = [...data].sort((a, b) => b.level - a.level).slice(0, 6)
        setSkillLevels(topSkills)
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkExperience = async () => {
    try {
      const response = await fetch('/api/public/experience')
      if (response.ok) {
        const data: WorkExperience[] = await response.json()
        setWorkExperience(data)
      }
    } catch (error) {
      console.error('Failed to fetch work experience:', error)
    }
  }

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
          <h2 className="heading-2 mb-4">{settings.aboutTitle || 'Hakkımda'}</h2>
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            {settings.aboutDescription || 'Tutkuyla kod yazan, detaylara önem veren bir geliştirici'}
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
            <div className="prose prose-lg max-w-none">
              {settings.aboutBio1 && (
                <p className="text-light-text-primary dark:text-dark-text-primary leading-relaxed mb-4">
                  {settings.aboutBio1}
                </p>
              )}
              {settings.aboutBio2 && (
                <p className="text-light-text-primary dark:text-dark-text-primary leading-relaxed mb-4">
                  {settings.aboutBio2}
                </p>
              )}
              {settings.aboutBio3 && (
                <p className="text-light-text-primary dark:text-dark-text-primary leading-relaxed mb-6">
                  {settings.aboutBio3}
                </p>
              )}
            </div>

            {/* Download Buttons */}
            <div className="flex flex-wrap gap-4">
              {settings.cvFileUrl && (
                <a
                  href={settings.cvFileUrl}
                  download
                  className="btn-primary inline-flex group"
                >
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  CV İndir
                </a>
              )}
              {settings.testFileUrl && (
                <a
                  href={settings.testFileUrl}
                  download
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-electric"></div>
              </div>
            ) : (
              <>
                {/* Skills by Category */}
                <div className="grid gap-4 mb-6">
                  {Object.entries(skills).map(([category, items], index) => {
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
                        <div className="flex flex-wrap gap-2">
                          {items.map((skill) => (
                            <span
                              key={skill.id}
                              className="px-2.5 py-1 text-xs bg-light-bg-tertiary dark:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary rounded-md border border-light-border dark:border-dark-border hover:border-accent-electric dark:hover:border-accent-purple transition-colors"
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
                    <li className="flex items-start gap-2">
                      <span className="text-accent-electric mt-0.5">✓</span>
                      <span>Agile/Scrum metodolojisi ile çalışma</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-purple mt-0.5">✓</span>
                      <span>Test-driven development (TDD) yaklaşımı</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-pink mt-0.5">✓</span>
                      <span>Sürekli öğrenme ve kendini geliştirme</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-electric mt-0.5">✓</span>
                      <span>Clean code ve best practices'e önem</span>
                    </li>
                  </ul>
                </motion.div>
              </>
            )}
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
          {!loading && skillLevels.length > 0 && (
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
            {workExperience.length === 0 ? (
              <p className="text-center text-light-text-secondary dark:text-dark-text-secondary">
                Henüz iş deneyimi eklenmedi.
              </p>
            ) : (
              workExperience.map((work, index) => (
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
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary line-clamp-3 break-words">
                      {work.description}
                    </p>
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
