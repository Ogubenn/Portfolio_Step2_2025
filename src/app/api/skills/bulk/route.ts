import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * DELETE /api/skills/bulk
 * Bulk delete multiple skills
 */
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { ids } = await request.json()

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'IDs array is required' },
        { status: 400 }
      )
    }

    // Fetch skill names for activity log
    const skills = await prisma.skill.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, category: true }
    })

    // Delete all skills
    const deleteResult = await prisma.skill.deleteMany({
      where: { id: { in: ids } }
    })

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: 'delete',
        entity: 'skill',
        entityId: 'bulk',
        description: `${deleteResult.count} yetenek toplu olarak silindi: ${skills.map((s: { name: string }) => s.name).join(', ')}`,
        metadata: JSON.stringify({ 
          count: deleteResult.count, 
          skillIds: ids,
          names: skills.map((s: { name: string }) => s.name)
        })
      }
    })

    return NextResponse.json({
      message: `${deleteResult.count} yetenek başarıyla silindi`,
      count: deleteResult.count
    })
  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Yetenekler silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
