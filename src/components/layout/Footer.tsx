'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Github, Linkedin, Mail } from 'lucide-react'
import { navItems } from '@/data/navigation'

interface SiteSettings {
  contactEmail: string | null
  socialLinks: string
}

export default function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()
  const [settings, setSettings] = useState<SiteSettings>({
    contactEmail: null,
    socialLinks: '{}'
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/public/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings({
          contactEmail: data.contactEmail,
          socialLinks: data.socialLinks || '{}'
        })
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const socialLinks = JSON.parse(settings.socialLinks)

  // Admin sayfalarında footer'ı gizle
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="bg-dark-bg-primary text-dark-text-primary border-t border-dark-border">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-10 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Brand & Social */}
          <div className="space-y-6">
            <div>
              <Link
                href="/"
                className="text-2xl font-bold text-dark-text-primary hover:text-accent-electric transition-colors inline-block mb-3"
              >
                Oğulcan Durkan
              </Link>
              <p className="text-dark-text-secondary text-sm max-w-md">
                Web ve oyun geliştiricisi.
              </p>
            </div>
            
            {/* Social Links - Daha büyük ve belirgin */}
            <div className="flex gap-4">
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-11 h-11 rounded-xl bg-dark-bg-secondary hover:bg-dark-bg-tertiary text-dark-text-primary flex items-center justify-center transition-all duration-300 border border-dark-border hover:border-accent-electric"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-11 h-11 rounded-xl bg-dark-bg-secondary hover:bg-dark-bg-tertiary text-dark-text-primary flex items-center justify-center transition-all duration-300 border border-dark-border hover:border-accent-purple"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {settings.contactEmail && (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="group relative w-11 h-11 rounded-xl bg-dark-bg-secondary hover:bg-dark-bg-tertiary text-dark-text-primary flex items-center justify-center transition-all duration-300 border border-dark-border hover:border-accent-pink"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              )}
            </div>
          </div>

          {/* Right Side - Navigation */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-semibold mb-4 text-dark-text-primary">Menü</h3>
              <ul className="space-y-2.5">
                {navItems.slice(0, 4).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-dark-text-secondary hover:text-accent-electric transition-colors duration-200 text-sm inline-block"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-base font-semibold mb-4 text-dark-text-primary">Yasal</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/privacy"
                    className="text-dark-text-secondary hover:text-accent-electric transition-colors duration-200 text-sm inline-block"
                  >
                    Gizlilik
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-dark-text-secondary hover:text-accent-electric transition-colors duration-200 text-sm inline-block"
                  >
                    Kullanım Şartları
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Minimalist */}
        <div className="border-t border-dark-border py-6">
          <p className="text-dark-text-tertiary text-sm text-center">
            © Ogubenn All Rights Reserved. Designed by Oğulcan Durkan
          </p>
        </div>
      </div>
    </footer>
  )
}
