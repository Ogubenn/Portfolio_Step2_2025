import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [projects, skills, experience, services] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.workExperience.count(),
      prisma.service.count().catch(() => 0) // Service table might not exist yet
    ])

    return NextResponse.json({
      projects,
      skills,
      experience,
      services
    })
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
