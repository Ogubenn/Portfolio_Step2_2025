import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Tüm yetenekleri getir (Admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = category ? { category } : {};

    const skills = await prisma.skill.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
      ],
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error('GET /api/skills error:', error);
    return NextResponse.json(
      { error: 'Yetenekler getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni yetenek ekle
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { category, name, level, icon, visible } = body;

    // Validasyon
    if (!category || !name) {
      return NextResponse.json(
        { error: 'Kategori ve isim zorunludur' },
        { status: 400 }
      );
    }

    // Aynı kategorideki son order değerini bul
    const lastSkill = await prisma.skill.findFirst({
      where: { category },
      orderBy: { order: 'desc' },
    });

    const skill = await prisma.skill.create({
      data: {
        category,
        name,
        level: level || 80,
        icon: icon || null,
        order: (lastSkill?.order || 0) + 1,
        visible: visible !== false,
      },
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        action: 'create',
        entity: 'skill',
        entityId: skill.id,
        description: `Yeni yetenek eklendi: ${name}`,
      },
    });

    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error('POST /api/skills error:', error);
    return NextResponse.json(
      { error: 'Yetenek eklenemedi' },
      { status: 500 }
    );
  }
}
