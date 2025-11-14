import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all work experiences (Admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const experiences = await prisma.workExperience.findMany({
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' }
      ]
    })

    return NextResponse.json(experiences)
  } catch (error) {
    console.error('Error fetching work experiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch work experiences' },
      { status: 500 }
    )
  }
}

// POST new work experience
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { company, position, startDate, endDate, current, description, location, type } = body

    if (!company || !position || !startDate || !description) {
      return NextResponse.json(
        { error: 'Company, position, startDate, and description are required' },
        { status: 400 }
      )
    }

    // Get the last order number
    const lastExperience = await prisma.workExperience.findFirst({
      orderBy: { order: 'desc' }
    })

    const experience = await prisma.workExperience.create({
      data: {
        company,
        position,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current: current || false,
        description,
        location,
        type,
        order: (lastExperience?.order || 0) + 1,
        visible: true
      }
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        action: 'CREATE',
        entity: 'WorkExperience',
        entityId: experience.id,
        description: `Created work experience: ${position} at ${company}`
      }
    })

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    console.error('Error creating work experience:', error)
    return NextResponse.json(
      { error: 'Failed to create work experience' },
      { status: 500 }
    )
  }
}
