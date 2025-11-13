'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react'
import { navItems } from '@/data/navigation'
import { socialLinks } from '@/data/social'

export default function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  // Admin sayfalarında footer'ı gizle
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="bg-dark-bg-primary text-dark-text-primary border-t border-dark-border">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-8 md:py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Column */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold text-dark-text-primary hover:text-accent-electric transition-colors inline-block mb-4"
            >
              Oğulcan<span className="text-gradient">.</span>
            </Link>
            <p className="text-dark-text-secondary text-sm">
              Web ve oyun geliştirme konusunda tutkulu bir yazılımcı.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-dark-text-secondary hover:text-accent-electric transition-colors duration-200 flex items-center gap-1 group text-sm"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3 text-dark-text-secondary text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-accent-electric flex-shrink-0" />
                <a
                  href="mailto:your.email@example.com"
                  className="hover:text-accent-electric transition-colors"
                >
                  your.email@example.com
                </a>
              </li>
            </ul>
            {/* Social Links */}
            <div className="flex gap-3 mt-4">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-dark-bg-secondary hover:bg-gradient-to-r hover:from-accent-electric hover:via-accent-purple hover:to-accent-pink text-dark-text-primary flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 border border-dark-border"
                  aria-label={link.platform}
                >
                  {getSocialIcon(link.platform)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-border py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-dark-text-tertiary text-sm text-center md:text-left">
              © {currentYear} Oğulcan. Sevgiyle kodlandı ❤️
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy"
                className="text-dark-text-tertiary hover:text-accent-electric transition-colors"
              >
                Gizlilik
              </Link>
              <Link
                href="/terms"
                className="text-dark-text-tertiary hover:text-accent-electric transition-colors"
              >
                Kullanım Şartları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Helper function for social icons
function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case 'github':
      return <Github className="w-5 h-5" />
    case 'linkedin':
      return <Linkedin className="w-5 h-5" />
    case 'email':
      return <Mail className="w-5 h-5" />
    default:
      return <ExternalLink className="w-5 h-5" />
  }
}
