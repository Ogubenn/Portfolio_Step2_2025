import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Proje resimlerini getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const images = await prisma.projectImage.findMany({
      where: { projectId: params.id },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Get images error:', error);
    return NextResponse.json(
      { error: 'Resimler getirilemedi' },
      { status: 500 }
    );
  }
}

// POST - Yeni resim ekle
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url, alt } = await request.json();

    // Mevcut resim sayısını kontrol et (max 3)
    const existingCount = await prisma.projectImage.count({
      where: { projectId: params.id },
    });

    if (existingCount >= 3) {
      return NextResponse.json(
        { error: 'Maksimum 3 resim yükleyebilirsiniz' },
        { status: 400 }
      );
    }

    const image = await prisma.projectImage.create({
      data: {
        projectId: params.id,
        url,
        alt: alt || '',
        order: existingCount,
      },
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Add image error:', error);
    return NextResponse.json(
      { error: 'Resim eklenemedi' },
      { status: 500 }
    );
  }
}

// DELETE - Resim sil
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID gerekli' },
        { status: 400 }
      );
    }

    await prisma.projectImage.delete({
      where: { id: imageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { error: 'Resim silinemedi' },
      { status: 500 }
    );
  }
}
