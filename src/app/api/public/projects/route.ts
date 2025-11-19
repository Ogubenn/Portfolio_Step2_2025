import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering - no cache
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Public endpoint - authentication gerekmez
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const where: any = {
      published: true, // Sadece yayında olanlar
    };

    if (category && category !== "all") {
      where.category = category;
    }

    if (featured === "true") {
      where.featured = true;
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
    });

    // Technologies ve tags JSON parse et
    const parsedProjects = projects.map((project: any) => ({
      ...project,
      technologies: JSON.parse(project.technologies),
      tags: JSON.parse(project.tags),
    }));

    const response = NextResponse.json(parsedProjects);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return response;
  } catch (error) {
    console.error("GET /api/public/projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
