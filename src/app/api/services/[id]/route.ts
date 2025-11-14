import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch single service
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const service = await prisma.service.findUnique({
      where: { id: params.id }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json(service)
  } catch (error) {
    console.error('Failed to fetch service:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

// PUT - Update service
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
    const { title, description, icon, features, order, visible } = body

    const service = await prisma.service.update({
      where: { id: params.id },
      data: {
        title,
        description,
        icon,
        features: typeof features === 'string' ? features : JSON.stringify(features || []),
        order,
        visible
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user?.email || null,
        action: 'UPDATE',
        entity: 'service',
        entityId: service.id,
        description: `Updated service: ${service.title}`
      }
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Failed to update service:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

// DELETE - Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const service = await prisma.service.findUnique({
      where: { id: params.id }
    })

    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    await prisma.service.delete({
      where: { id: params.id }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user?.email || null,
        action: 'DELETE',
        entity: 'service',
        entityId: service.id,
        description: `Deleted service: ${service.title}`
      }
    })

    return NextResponse.json({ message: 'Service deleted successfully' })
  } catch (error) {
    console.error('Failed to delete service:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}
