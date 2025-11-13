import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AuthProvider from '@/components/providers/AuthProvider'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Oğulcan - Full-Stack Developer & Yaratıcı Yazılımcı',
    template: '%s | Oğulcan',
  },
  description: 'Web ve oyun geliştirme konusunda tutkulu bir yazılımcı. React, Next.js, TypeScript ve modern teknolojilerle yaratıcı projeler geliştiriyorum.',
  keywords: ['full-stack developer', 'web developer', 'game developer', 'react', 'next.js', 'typescript', 'unity', 'portfolio', 'yazılımcı'],
  authors: [{ name: 'Oğulcan' }],
  creator: 'Oğulcan',
  metadataBase: new URL('https://yourwebsite.com'), // Kendi domain'inizi buraya ekleyin
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://yourwebsite.com',
    siteName: 'Oğulcan - Portfolio',
    title: 'Oğulcan - Full-Stack Developer & Yaratıcı Yazılımcı',
    description: 'Web ve oyun geliştirme konusunda tutkulu bir yazılımcı.',
    images: [
      {
        url: '/og-image.jpg', // Open Graph görseli ekleyin
        width: 1200,
        height: 630,
        alt: 'Oğulcan Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oğulcan - Full-Stack Developer',
    description: 'Web ve oyun geliştirme konusunda tutkulu bir yazılımcı.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`dark ${inter.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
