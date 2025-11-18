'use client'

import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface SiteSettings {
  heroTitle: string
  heroSubtitle: string
  heroCTA: string | null
  heroImage: string | null
}

export default function Hero() {
  const [settings, setSettings] = useState<SiteSettings>({
    heroTitle: 'Merhaba, ben Oğulcan 👋',
    heroSubtitle: 'Full-Stack Developer & Yaratıcı Yazılımcı',
    heroCTA: 'Projelerimi Gör',
    heroImage: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch(`/api/public/settings?t=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        setSettings({
          heroTitle: data.heroTitle || 'Merhaba, ben Oğulcan 👋',
          heroSubtitle: data.heroSubtitle || 'Full-Stack Developer & Yaratıcı Yazılımcı',
          heroCTA: data.heroCTA || 'Projelerimi Gör',
          heroImage: data.heroImage || null
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative pt-20 bg-gradient-to-br from-light-bg-primary via-light-bg-secondary to-light-bg-primary dark:from-dark-bg-primary dark:via-dark-bg-secondary dark:to-dark-bg-primary"
    >
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gradient font-medium mb-4"
            >
              {settings.heroTitle}
            </motion.p>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="heading-1 mb-6"
            >
              {settings.heroSubtitle.split('&').map((part, index) => (
                index === 0 ? (
                  <span key={index}>{part} & </span>
                ) : (
                  <span key={index} className="text-gradient">{part}</span>
                )
              ))}
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              Web teknolojileri ve oyun geliştirme konusunda tutkulu bir yazılımcıyım.
              Kullanıcı deneyimini ön planda tutarak, modern ve performanslı projeler
              geliştirmeyi seviyorum.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/#projects" className="btn-primary group">
                {settings.heroCTA || 'Projelerimi Gör'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/#contact" className="btn-secondary">
                İletişime Geç
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Image/Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative hidden lg:flex justify-center items-center"
          >
            {/* Placeholder for profile image or illustration */}
            <div className="relative w-full max-w-lg aspect-square">
              {/* Decorative background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-electric/20 via-accent-purple/20 to-accent-pink/20 rounded-2xl transform rotate-6 animate-pulse-slow" />
              <div className="absolute inset-0 bg-gradient-to-tr from-accent-pink/20 via-accent-purple/20 to-accent-electric/20 rounded-2xl transform -rotate-6" />
              
              {/* Main image container */}
              <div className="relative w-full h-full bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-2xl overflow-hidden shadow-large flex items-center justify-center border border-light-border dark:border-dark-border">
                {settings.heroImage ? (
                  <img
                    src={settings.heroImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4">👨‍💻</div>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">
                      Buraya profilinizin fotoğrafını veya<br />
                      özel bir illüstrasyon ekleyebilirsiniz
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <Link
          href="/#about"
          className="flex flex-col items-center gap-2 text-light-text-secondary dark:text-dark-text-secondary hover:text-accent-electric dark:hover:text-accent-electric transition-colors group"
          aria-label="Scroll to about section"
        >
          <span className="text-sm font-medium">Daha Fazla Keşfet</span>
          <ChevronDown className="w-6 h-6 animate-bounce-subtle" />
        </Link>
      </motion.div>
    </section>
  )
}
