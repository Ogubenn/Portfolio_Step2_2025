import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering - no cache
export const dynamic = 'force-dynamic'
export const revalidate = 0

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

    const response = NextResponse.json(experiences)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    return response
  } catch (error) {
    console.error('Error fetching work experiences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch work experiences' },
      { status: 500 }
    )
  }
}
