import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Tek yetenek detayı
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const skill = await prisma.skill.findUnique({
      where: { id: params.id },
    });

    if (!skill) {
      return NextResponse.json(
        { error: 'Yetenek bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(skill);
  } catch (error) {
    console.error('GET /api/skills/[id] error:', error);
    return NextResponse.json(
      { error: 'Yetenek getirilemedi' },
      { status: 500 }
    );
  }
}

// PUT - Yetenek güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { category, name, level, icon, order, visible } = body;

    const skill = await prisma.skill.update({
      where: { id: params.id },
      data: {
        category,
        name,
        level,
        icon: icon || null,
        order: order !== undefined ? order : undefined,
        visible: visible !== undefined ? visible : undefined,
      },
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        action: 'update',
        entity: 'skill',
        entityId: skill.id,
        description: `Yetenek güncellendi: ${name}`,
      },
    });

    return NextResponse.json(skill);
  } catch (error) {
    console.error('PUT /api/skills/[id] error:', error);
    return NextResponse.json(
      { error: 'Yetenek güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Yetenek sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const skill = await prisma.skill.findUnique({
      where: { id: params.id },
    });

    if (!skill) {
      return NextResponse.json(
        { error: 'Yetenek bulunamadı' },
        { status: 404 }
      );
    }

    await prisma.skill.delete({
      where: { id: params.id },
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        action: 'delete',
        entity: 'skill',
        entityId: params.id,
        description: `Yetenek silindi: ${skill.name}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/skills/[id] error:', error);
    return NextResponse.json(
      { error: 'Yetenek silinemedi' },
      { status: 500 }
    );
  }
}
