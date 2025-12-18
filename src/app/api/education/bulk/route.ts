import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// DELETE - Bulk delete education entries
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ids } = await request.json()

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'ID listesi gerekli' },
        { status: 400 }
      )
    }

    // Fetch education titles before deletion (for logging)
    const educations = await prisma.education.findMany({
      where: { id: { in: ids } },
      select: { id: true, school: true, degree: true }
    })

    // Bulk delete
    const result = await prisma.education.deleteMany({
      where: { id: { in: ids } }
    })

    // Activity log
    try {
      await prisma.activityLog.create({
        data: {
          userId: (session.user as any)?.id || null,
          action: 'delete',
          entity: 'education',
          entityId: ids.join(','),
          description: `${result.count} eğitim toplu silindi`,
          metadata: JSON.stringify(educations.map(e => `${e.school} - ${e.degree}`))
        }
      })
    } catch (logError) {
      console.error('Activity log error:', logError)
    }

    return NextResponse.json({ 
      success: true, 
      count: result.count,
      message: `${result.count} eğitim silindi`
    })
  } catch (error) {
    console.error('DELETE /api/education/bulk error:', error)
    return NextResponse.json(
      { error: 'Toplu silme başarısız oldu' },
      { status: 500 }
    )
  }
}
