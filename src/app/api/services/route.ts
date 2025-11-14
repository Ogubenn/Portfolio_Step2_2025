import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all services (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const services = await prisma.service.findMany({
      where: search ? {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } }
        ]
      } : undefined,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

// POST - Create new service
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, icon, features, visible = true } = body

    // Validation
    if (!title || !description || !icon) {
      return NextResponse.json(
        { error: 'Title, description, and icon are required' },
        { status: 400 }
      )
    }

    // Get the last service's order
    const lastService = await prisma.service.findFirst({
      orderBy: { order: 'desc' }
    })

    const newOrder = lastService ? lastService.order + 1 : 0

    const service = await prisma.service.create({
      data: {
        title,
        description,
        icon,
        features: typeof features === 'string' ? features : JSON.stringify(features || []),
        order: newOrder,
        visible
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: session.user?.email || null,
        action: 'CREATE',
        entity: 'service',
        entityId: service.id,
        description: `Created service: ${service.title}`
      }
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Failed to create service:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}
