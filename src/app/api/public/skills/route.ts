import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Public yetenekler listesi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: any = { visible: true };
    if (category) {
      where.category = category;
    }

    const skills = await prisma.skill.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
      ],
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error('GET /api/public/skills error:', error);
    return NextResponse.json(
      { error: 'Yetenekler getirilemedi' },
      { status: 500 }
    );
  }
}
