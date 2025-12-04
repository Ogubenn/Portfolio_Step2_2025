import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/profile
 * Get current user profile
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Profil bilgileri alınamadı' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/profile
 * Update user profile (email, name, password)
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, name, currentPassword, newPassword } = await request.json()

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email ve isim gereklidir' },
        { status: 400 }
      )
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if email is being changed and already exists
    if (email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      if (existingUser) {
        return NextResponse.json(
          { error: 'Bu email adresi zaten kullanılıyor' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      email,
      name,
      updatedAt: new Date()
    }

    // Handle password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Mevcut şifre gereklidir' },
          { status: 400 }
        )
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Mevcut şifre hatalı' },
          { status: 400 }
        )
      }

      // Validate new password strength
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Yeni şifre en az 6 karakter olmalıdır' },
          { status: 400 }
        )
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Create activity log
    const changes: string[] = []
    if (email !== user.email) changes.push(`email: ${user.email} → ${email}`)
    if (name !== user.name) changes.push(`isim: ${user.name} → ${name}`)
    if (newPassword) changes.push('şifre değiştirildi')

    await prisma.activityLog.create({
      data: {
        action: 'update',
        entity: 'user',
        entityId: user.id,
        description: `Profil güncellendi: ${changes.join(', ')}`,
        metadata: JSON.stringify({ userId: user.id, changes })
      }
    })

    return NextResponse.json({
      message: 'Profil başarıyla güncellendi',
      user: updatedUser
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Profil güncellenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
