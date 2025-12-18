import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - List all education entries
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const education = await prisma.education.findMany({
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' }
      ]
    })

    // Parse achievements JSON
    const parsedEducation = education.map(edu => ({
      ...edu,
      achievements: JSON.parse(edu.achievements || '[]')
    }))

    return NextResponse.json(parsedEducation)
  } catch (error) {
    console.error('GET /api/education error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    )
  }
}

// POST - Create new education entry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const body = await request.json()
    const {
      school,
      degree,
      field,
      startDate,
      endDate,
      current,
      gpa,
      description,
      location,
      achievements,
      order,
      visible
    } = body

    // Validation
    if (!school || !degree || !field || !startDate || !description) {
      return NextResponse.json(
        { error: 'Okul, derece, alan, başlangıç tarihi ve açıklama zorunludur' },
        { status: 400 }
      )
    }

    const education = await prisma.education.create({
      data: {
        school,
        degree,
        field,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current: current || false,
        gpa: gpa || null,
        description,
        location: location || null,
        achievements: JSON.stringify(achievements || []),
        order: order || 0,
        visible: visible !== false
      }
    })

    // Activity log
    await prisma.activityLog.create({
      data: {
        userId: (session.user as any).email,
        action: 'create',
        entity: 'education',
        entityId: education.id,
        description: `Yeni eğitim eklendi: ${school} - ${degree}`
      }
    })

    return NextResponse.json({
      ...education,
      achievements: JSON.parse(education.achievements)
    })
  } catch (error) {
    console.error('POST /api/education error:', error)
    return NextResponse.json(
      { 
        error: 'Eğitim kaydı oluşturulamadı',
        details: error instanceof Error ? error.message : 'Bilinmeyen hata'
      },
      { status: 500 }
    )
  }
}
