import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering - no cache
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 1 }
    })

    // If no settings exist, return defaults
    if (!settings) {
      const response = NextResponse.json({
        heroTitle: 'Merhaba, Ben [İsim]',
        heroSubtitle: 'Full-Stack Developer & Designer',
        heroBio: 'Web teknolojileri ve oyun geliştirme konusunda tutkulu bir yazılımcıyım. Kullanıcı deneyimini ön planda tutarak, modern ve performanslı projeler geliştirmeyi seviyorum.',
        heroCTA: 'Projelerime Göz At',
        heroImage: null,
        aboutTitle: null,
        aboutDescription: 'Hakkımda kısa açıklama...',
        aboutBio1: null,
        aboutBio2: null,
        aboutBio3: null,
        cvFileUrl: null,
        testFileUrl: null,
        contactEmail: null,
        contactPhone: null,
        contactLocation: null,
        socialLinks: JSON.stringify({
          github: '',
          linkedin: ''
        })
      })
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
      return response
    }

    const response = NextResponse.json(settings)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    return response
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}
