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

    // Safe JSON parse helper
    const safeJsonParse = (value: string, fallback: any = []): any => {
      if (!value) return fallback
      try {
        return JSON.parse(value)
      } catch (error) {
        console.error('JSON Parse Error in /api/public/projects:', error, 'Value:', value)
        return fallback
      }
    }

    // Technologies ve tags JSON parse et (safely)
    const parsedProjects = projects.map((project: any) => ({
      ...project,
      technologies: safeJsonParse(project.technologies, []),
      tags: safeJsonParse(project.tags, []),
    }));

    // Debug log
    console.log('API /api/public/projects response:', {
      count: parsedProjects.length,
      firstProject: parsedProjects[0] ? {
        title: parsedProjects[0].title,
        shortDesc: parsedProjects[0].shortDesc,
        hasShortDesc: !!parsedProjects[0].shortDesc
      } : 'No projects'
    });

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
