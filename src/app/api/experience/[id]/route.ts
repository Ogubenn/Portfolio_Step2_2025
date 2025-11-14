import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET single work experience
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const experience = await prisma.workExperience.findUnique({
      where: { id: params.id }
    })

    if (!experience) {
      return NextResponse.json(
        { error: 'Work experience not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error fetching work experience:', error)
    return NextResponse.json(
      { error: 'Failed to fetch work experience' },
      { status: 500 }
    )
  }
}

// PUT update work experience
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
    const { company, position, startDate, endDate, current, description, location, type, order, visible } = body

    const experience = await prisma.workExperience.update({
      where: { id: params.id },
      data: {
        company,
        position,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : null,
        current,
        description,
        location,
        type,
        order,
        visible
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'UPDATE',
        entity: 'WorkExperience',
        entityId: experience.id,
        description: `Updated work experience: ${position} at ${company}`
      }
    })

    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error updating work experience:', error)
    return NextResponse.json(
      { error: 'Failed to update work experience' },
      { status: 500 }
    )
  }
}

// DELETE work experience
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const experience = await prisma.workExperience.findUnique({
      where: { id: params.id }
    })

    if (!experience) {
      return NextResponse.json(
        { error: 'Work experience not found' },
        { status: 404 }
      )
    }

    await prisma.workExperience.delete({
      where: { id: params.id }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'DELETE',
        entity: 'WorkExperience',
        entityId: params.id,
        description: `Deleted work experience: ${experience.position} at ${experience.company}`
      }
    })

    return NextResponse.json({ message: 'Work experience deleted successfully' })
  } catch (error) {
    console.error('Error deleting work experience:', error)
    return NextResponse.json(
      { error: 'Failed to delete work experience' },
      { status: 500 }
    )
  }
}
