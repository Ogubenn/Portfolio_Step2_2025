import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET - Public education entries (visible only, ordered)
export async function GET() {
  try {
    const education = await prisma.education.findMany({
      where: { visible: true },
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' }
      ]
    })

    // Parse achievements JSON
    const parsedEducation = education.map(edu => ({
      ...edu,
      achievements: JSON.parse(edu.achievements || '[]')
    }))

    const response = NextResponse.json(parsedEducation)
    
    // Cache control headers (no-cache for real-time updates)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('GET /api/public/education error:', error)
    
    // Return empty array on error (prevents frontend crash)
    return NextResponse.json([])
  }
}
