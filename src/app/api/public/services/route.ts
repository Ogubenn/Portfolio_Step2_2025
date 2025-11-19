import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering - no cache
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' }
    })

    const response = NextResponse.json(services)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    return response
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}
