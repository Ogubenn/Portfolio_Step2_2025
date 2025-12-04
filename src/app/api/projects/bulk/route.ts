import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * DELETE /api/projects/bulk
 * Bulk delete multiple projects
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

    // Fetch project titles for activity log
    const projects = await prisma.project.findMany({
      where: { id: { in: ids } },
      select: { id: true, title: true }
    })

    // Delete all projects (cascade will handle ProjectImage)
    const deleteResult = await prisma.project.deleteMany({
      where: { id: { in: ids } }
    })

    // Create activity log
    await prisma.activityLog.create({
      data: {
        action: 'delete',
        entity: 'project',
        entityId: 'bulk',
        description: `${deleteResult.count} proje toplu olarak silindi: ${projects.map((p: { title: string }) => p.title).join(', ')}`,
        metadata: JSON.stringify({ 
          count: deleteResult.count, 
          projectIds: ids,
          titles: projects.map((p: { title: string }) => p.title)
        })
      }
    })

    return NextResponse.json({
      message: `${deleteResult.count} proje başarıyla silindi`,
      count: deleteResult.count
    })
  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Projeler silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
