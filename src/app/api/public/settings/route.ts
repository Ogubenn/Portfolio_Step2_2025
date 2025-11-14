import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { id: 1 }
    })

    // If no settings exist, return defaults
    if (!settings) {
      return NextResponse.json({
        heroTitle: 'Merhaba, Ben [İsim]',
        heroSubtitle: 'Full-Stack Developer & Designer',
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
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}
