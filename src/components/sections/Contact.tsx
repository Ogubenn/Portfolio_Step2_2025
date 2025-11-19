'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Mail, Github, Linkedin, MapPin, Phone } from 'lucide-react'

interface SiteSettings {
  contactEmail: string | null
  contactPhone: string | null
  contactLocation: string | null
  socialLinks: string
}

interface ContactProps {
  settings: SiteSettings | null
}

const defaultSettings: SiteSettings = {
  contactEmail: null,
  contactPhone: null,
  contactLocation: null,
  socialLinks: '{}'
}

export default function Contact({ settings }: ContactProps) {
  const data = settings || defaultSettings
  const socialLinks = JSON.parse(data.socialLinks)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '', // Spam protection
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Honeypot spam check
    if (formData.honeypot) {
      return // Silently fail for bots
    }

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error')
      setErrorMessage('Lütfen tüm alanları doldurun.')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setStatus('error')
      setErrorMessage('Geçerli bir e-posta adresi girin.')
      return
    }

    setStatus('loading')

    try {
      // Burada form submit işlemi yapılır (örn: API call, email service, etc.)
      // Şimdilik simüle ediyoruz
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStatus('success')
      setFormData({ name: '', email: '', message: '', honeypot: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000)
    } catch (error) {
      setStatus('error')
      setErrorMessage('Bir hata oluştu. Lütfen tekrar deneyin.')
    }
  }

  return (
    <section id="contact" className="section-padding bg-gradient-to-br from-light-bg-primary via-light-bg-secondary to-light-bg-primary dark:from-dark-bg-primary dark:via-dark-bg-secondary dark:to-dark-bg-primary">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-2 mb-4">İletişime Geç</h2>
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto">
            Bir fikrin mi var? Birlikte harika şeyler yaratabiliriz! 🚀
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
          {/* Contact Form - Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="label">
                  İsim *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Adınız Soyadınız"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="label">
                  E-posta *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  placeholder="ornek@email.com"
                  required
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="label">
                  Mesaj *
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="textarea"
                  placeholder="Projen veya fikrin hakkında biraz bilgi verir misin?..."
                  rows={6}
                  required
                />
              </div>

              {/* Honeypot - Hidden from users */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="honeypot">Leave this empty</label>
                <input
                  type="text"
                  id="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="flex items-center gap-2 p-4 bg-success/10 text-success rounded-lg border border-success/30">
                  <CheckCircle className="w-5 h-5" />
                  <span>Mesajınız başarıyla gönderildi! En kısa sürede döneceğim.</span>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 p-4 bg-error/10 text-error rounded-lg border border-error/30">
                  <AlertCircle className="w-5 h-5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full sm:w-auto group"
              >
                {status === 'loading' ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    Gönder
                    <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info - Right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Email */}
            {data.contactEmail && (
              <div className="card">
                <div className="text-4xl mb-3">📧</div>
                <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">E-posta</h3>
                <a
                  href={`mailto:${data.contactEmail}`}
                  className="text-gradient hover:underline"
                >
                  {data.contactEmail}
                </a>
              </div>
            )}

            {/* Phone */}
            {data.contactPhone && (
              <div className="card">
                <div className="text-4xl mb-3">📞</div>
                <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">Telefon</h3>
                <a
                  href={`tel:${data.contactPhone}`}
                  className="text-gradient hover:underline"
                >
                  {data.contactPhone}
                </a>
              </div>
            )}

            {/* Location */}
            {data.contactLocation && (
              <div className="card">
                <div className="text-4xl mb-3">📍</div>
                <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">Konum</h3>
                <p className="text-light-text-secondary dark:text-dark-text-secondary">
                  {data.contactLocation}
                </p>
              </div>
            )}

            {/* LinkedIn */}
            {socialLinks.linkedin && (
              <div className="card">
                <div className="text-4xl mb-3">💼</div>
                <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">LinkedIn</h3>
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gradient hover:underline inline-flex items-center gap-2"
                >
                  Profili Görüntüle
                  <span className="text-sm">↗</span>
                </a>
              </div>
            )}

            {/* GitHub */}
            {socialLinks.github && (
              <div className="card">
                <div className="text-4xl mb-3">💻</div>
                <h3 className="font-semibold text-light-text-primary dark:text-dark-text-primary mb-2">GitHub</h3>
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gradient hover:underline inline-flex items-center gap-2"
                >
                  Projeleri İncele
                  <span className="text-sm">↗</span>
                </a>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
