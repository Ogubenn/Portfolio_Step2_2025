import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE - Clear all activity logs
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete all activity logs
    const result = await prisma.activityLog.deleteMany({})

    // Create a new log entry for this action
    await prisma.activityLog.create({
      data: {
        userId: session.user?.email || null,
        action: 'DELETE',
        entity: 'activity_log',
        description: 'Cleared all activity logs'
      }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Activity logs cleared successfully',
      count: result.count 
    })
  } catch (error) {
    console.error('Failed to clear activity logs:', error)
    return NextResponse.json(
      { error: 'Failed to clear activity logs' },
      { status: 500 }
    )
  }
}
