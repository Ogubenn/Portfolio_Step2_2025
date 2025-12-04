import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

    const services = await prisma.service.findMany({
      where: { id: { in: ids } },
      select: { id: true, title: true }
    })

    const deleteResult = await prisma.service.deleteMany({
      where: { id: { in: ids } }
    })

    await prisma.activityLog.create({
      data: {
        action: 'delete',
        entity: 'service',
        entityId: 'bulk',
        description: `${deleteResult.count} hizmet toplu olarak silindi: ${services.map((s: { title: string }) => s.title).join(', ')}`,
        metadata: JSON.stringify({ 
          count: deleteResult.count, 
          serviceIds: ids,
          titles: services.map((s: { title: string }) => s.title)
        })
      }
    })

    return NextResponse.json({
      message: `${deleteResult.count} hizmet başarıyla silindi`,
      count: deleteResult.count
    })
  } catch (error) {
    console.error('Bulk delete error:', error)
    return NextResponse.json(
      { error: 'Hizmetler silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
