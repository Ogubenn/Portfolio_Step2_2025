import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all visible work experiences (Public)
export async function GET(request: NextRequest) {
  try {
    const experiences = await prisma.workExperience.findMany({
      where: { visible: true },
      orderBy: [
        { current: 'desc' }, // Current jobs first
        { startDate: 'desc' } // Then by most recent
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
