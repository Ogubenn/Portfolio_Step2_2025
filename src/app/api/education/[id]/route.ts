import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Single education entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const education = await prisma.education.findUnique({
      where: { id: params.id }
    })

    if (!education) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...education,
      achievements: JSON.parse(education.achievements || '[]')
    })
  } catch (error) {
    console.error('GET /api/education/[id] error:', error)
    return NextResponse.json(
      { error: 'Eğitim kaydı getirilemedi', details: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    )
  }
}

// PUT - Update education entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    const education = await prisma.education.update({
      where: { id: params.id },
      data: {
        ...(school && { school }),
        ...(degree && { degree }),
        ...(field && { field }),
        ...(startDate && { startDate: new Date(startDate) }),
        endDate: current ? null : (endDate ? new Date(endDate) : null),
        current: current || false,
        gpa: gpa || null,
        ...(description && { description }),
        location: location || null,
        achievements: JSON.stringify(achievements || []),
        order: order !== undefined ? order : undefined,
        visible: visible !== undefined ? visible : undefined
      }
    })

    // Activity log
    await prisma.activityLog.create({
      data: {
        userId: (session.user as any).email,
        action: 'update',
        entity: 'education',
        entityId: education.id,
        description: `Eğitim güncellendi: ${education.school} - ${education.degree}`
      }
    })

    return NextResponse.json({
      ...education,
      achievements: JSON.parse(education.achievements)
    })
  } catch (error) {
    console.error('PUT /api/education/[id] error:', error)
    return NextResponse.json(
      { error: 'Eğitim kaydı güncellenemedi', details: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    )
  }
}

// DELETE - Delete education entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const education = await prisma.education.findUnique({
      where: { id: params.id }
    })

    if (!education) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 })
    }

    await prisma.education.delete({
      where: { id: params.id }
    })

    // Activity log
    await prisma.activityLog.create({
      data: {
        userId: (session.user as any).email,
        action: 'delete',
        entity: 'education',
        entityId: params.id,
        description: `Eğitim silindi: ${education.school} - ${education.degree}`
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/education/[id] error:', error)
    return NextResponse.json(
      { error: 'Eğitim kaydı silinemedi', details: error instanceof Error ? error.message : 'Bilinmeyen hata' },
      { status: 500 }
    )
  }
}
