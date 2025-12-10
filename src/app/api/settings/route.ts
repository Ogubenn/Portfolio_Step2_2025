import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch site settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let settings = await prisma.siteSettings.findUnique({
      where: { id: 1 }
    })

    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: 1,
          heroTitle: 'Merhaba, Ben [İsim]',
          heroSubtitle: 'Full-Stack Developer & Designer',
          heroBio: 'Web teknolojileri ve oyun geliştirme konusunda tutkulu bir yazılımcıyım. Kullanıcı deneyimini ön planda tutarak, modern ve performanslı projeler geliştirmeyi seviyorum.',
          heroCTA: 'Projelerime Göz At',
          heroImage: null,
          aboutDescription: 'Hakkımda kısa açıklama...',
          aboutBio1: null,
          aboutBio2: null,
          aboutBio3: null,
          socialLinks: JSON.stringify({
            github: '',
            linkedin: ''
          })
        }
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

// PUT - Update site settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // 🔍 DEBUG: Gelen veri boyutlarını logla
    console.log('📊 Settings UPDATE - Data sizes:')
    console.log('  heroTitle:', body.heroTitle?.length || 0, 'chars')
    console.log('  heroSubtitle:', body.heroSubtitle?.length || 0, 'chars')
    console.log('  heroBio:', body.heroBio?.length || 0, 'chars')
    console.log('  aboutDescription:', body.aboutDescription?.length || 0, 'chars')
    console.log('  siteDescription:', body.siteDescription?.length || 0, 'chars')

    // Ensure socialLinks is a string
    if (body.socialLinks && typeof body.socialLinks !== 'string') {
      body.socialLinks = JSON.stringify(body.socialLinks)
    }

    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: body,
      create: {
        id: 1,
        ...body
      }
    })

    // 🔍 DEBUG: Kaydedilen veri boyutlarını kontrol et
    console.log('✅ Settings SAVED - Checking database values:')
    console.log('  heroTitle:', settings.heroTitle.length, 'chars')
    console.log('  heroSubtitle:', settings.heroSubtitle.length, 'chars')
    console.log('  heroBio:', settings.heroBio?.length || 0, 'chars')
    console.log('  aboutDescription:', settings.aboutDescription.length, 'chars')
    console.log('  siteDescription:', settings.siteDescription?.length || 0, 'chars')

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user?.email || null,
        action: 'UPDATE',
        entity: 'settings',
        entityId: '1',
        description: 'Updated site settings'
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
