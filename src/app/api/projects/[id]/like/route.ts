import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// POST - Projeye beğeni ekle
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Projeyi bul ve likes sayısını artır
    const project = await prisma.project.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
      select: {
        id: true,
        slug: true,
        likes: true,
      },
    });

    const response = NextResponse.json({ 
      success: true, 
      likes: project.likes 
    });

    // Cache-Control headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

    return response;
  } catch (error) {
    console.error("POST /api/projects/[id]/like error:", error);
    return NextResponse.json(
      { error: "Beğeni eklenemedi" },
      { status: 500 }
    );
  }
}
