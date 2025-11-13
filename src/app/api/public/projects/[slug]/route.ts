import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Public endpoint - tek proje detayı
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { 
        slug: params.slug,
        published: true, // Sadece yayında olanlar
      },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Technologies ve tags JSON parse et
    const parsedProject = {
      ...project,
      technologies: JSON.parse(project.technologies),
      tags: JSON.parse(project.tags),
    };

    return NextResponse.json(parsedProject);
  } catch (error) {
    console.error("GET /api/public/projects/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
