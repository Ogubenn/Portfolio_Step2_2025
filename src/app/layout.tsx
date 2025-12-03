import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import '@/styles/globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AuthProvider from '@/components/providers/AuthProvider'
import PageViewTracker from '@/components/analytics/PageViewTracker'
import { PersonSchema, WebsiteSchema } from '@/components/seo/JsonLd'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
})

// Disable static optimization for dynamic data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: {
    default: 'Oğulcan Benli - Full-Stack Developer & Creative Coder',
    template: '%s | Oğulcan Benli',
  },
  description: 'Full-stack yazılım geliştiricisi. React, Next.js, TypeScript, Node.js ve Unity ile modern web uygulamaları ve oyunlar geliştiriyorum. Türkiye\'de web geliştirme hizmetleri.',
  keywords: [
    // Core skills
    'full-stack developer', 'web developer', 'game developer', 'yazılım geliştirici',
    // Technologies
    'react', 'next.js', 'typescript', 'javascript', 'node.js', 'prisma', 'mysql', 'unity', 'c#',
    // Services
    'web development', 'game development', 'frontend', 'backend', 'full-stack',
    // Location
    'türkiye', 'turkey', 'istanbul',
    // General
    'portfolio', 'freelance', 'yazılımcı', 'developer portfolio'
  ],
  authors: [{ name: 'Oğulcan Benli', url: 'https://ogubenn.com.tr' }],
  creator: 'Oğulcan Benli',
  publisher: 'Oğulcan Benli',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://ogubenn.com.tr'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: process.env.NEXTAUTH_URL || 'https://ogubenn.com.tr',
    siteName: 'Oğulcan Benli - Portfolio',
    title: 'Oğulcan Benli - Full-Stack Developer & Creative Coder',
    description: 'Full-stack yazılım geliştiricisi. React, Next.js, TypeScript, Node.js ve Unity ile modern web uygulamaları ve oyunlar geliştiriyorum.',
    images: [
      {
        url: '/og-image.jpg', // TODO: Open Graph görseli ekleyin (1200x630px)
        width: 1200,
        height: 630,
        alt: 'Oğulcan Benli - Full-Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oğulcan Benli - Full-Stack Developer',
    description: 'React, Next.js, TypeScript, Node.js ve Unity ile modern web uygulamaları ve oyunlar geliştiriyorum.',
    images: ['/og-image.jpg'], // TODO: Twitter card görseli ekleyin
    creator: '@ogubenn', // TODO: Twitter username'inizi ekleyin
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
  const siteUrl = process.env.NEXTAUTH_URL || 'https://ogubenn.com.tr'
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  
  return (
    <html lang="tr" className={`dark ${inter.variable}`}>
      <head>
        {/* Google Analytics 4 */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className="antialiased">
        {/* JSON-LD Structured Data */}
        <PersonSchema
          name="Oğulcan Benli"
          url={siteUrl}
          image={`${siteUrl}/og-image.jpg`}
          jobTitle="Full-Stack Developer & Creative Coder"
          description="React, Next.js, TypeScript, Node.js ve Unity ile modern web uygulamaları ve oyunlar geliştiren yazılım geliştirici."
          email="ogulcan285@outlook.com"
          sameAs={[
            'https://github.com/ogubenn',
            'https://linkedin.com/in/ogubenn',
            'https://twitter.com/ogubenn',
          ]}
        />
        <WebsiteSchema
          name="Oğulcan Benli - Portfolio"
          url={siteUrl}
          description="Full-stack yazılım geliştiricisi. React, Next.js, TypeScript, Node.js ve Unity ile modern web uygulamaları ve oyunlar geliştiriyorum."
          author={{
            name: 'Oğulcan Benli',
            url: siteUrl,
          }}
        />
        
        <AuthProvider>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
        
        {/* Analytics tracking */}
        <PageViewTracker />
        <Analytics />
      </body>
    </html>
  )
}
