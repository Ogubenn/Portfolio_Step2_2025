'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { navItems } from '@/data/navigation'

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // Admin sayfalarında header'ı gizle
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (
    <>
      {/* Mobile Menu Overlay - MUST BE FIRST */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-dark-bg-primary/98 backdrop-blur-lg md:hidden z-[60]"
        >
          <nav className="container-custom pt-24 pb-8 h-full overflow-y-auto">
            <ul className="flex flex-col gap-6">
              {navItems.map((item, index) => (
                <li
                  key={item.href}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-2xl font-semibold text-dark-text-primary hover:text-accent-electric transition-colors block py-2"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li
                className="pt-4 animate-slide-up"
                style={{ animationDelay: '400ms' }}
              >
                <Link
                  href="/#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary w-full text-center inline-block"
                >
                  Benimle İletişime Geç
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Header - ALWAYS ON TOP */}
      <header
        className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-300 ${
          isScrolled
            ? 'bg-light-bg-primary/90 dark:bg-dark-bg-primary/90 backdrop-blur-glass shadow-soft'
            : isMobileMenuOpen
            ? 'bg-dark-bg-primary/95 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <nav className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl md:text-2xl font-bold text-light-text-primary dark:text-dark-text-primary hover:text-accent-electric dark:hover:text-accent-electric transition-colors duration-200 relative z-[80]"
            >
              Oğulcan<span className="text-gradient">.</span>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-light-text-secondary dark:text-dark-text-secondary hover:text-accent-electric dark:hover:text-accent-electric font-medium transition-colors duration-200 relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-electric via-accent-purple to-accent-pink transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right Side: CTA Button - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/#contact"
                className="btn-primary"
              >
                Benimle İletişime Geç
              </Link>
            </div>

            {/* Mobile: Menu Button */}
            <div className="flex md:hidden items-center relative z-[80]">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-light-text-primary dark:text-dark-text-primary hover:text-accent-electric dark:hover:text-accent-electric transition-colors"
                aria-label="Toggle menu"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
