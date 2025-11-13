import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Tüm projeleri listele
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST - Yeni proje oluştur
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      slug,
      title,
      category,
      description,
      shortDesc,
      thumbnail,
      videoUrl,
      demoUrl,
      githubUrl,
      technologies,
      tags,
      year,
      duration,
      problem,
      solution,
      process,
      learnings,
      featured,
      published,
      images,
    } = body;

    // Slug kontrolü
    const existingProject = await prisma.project.findUnique({
      where: { slug },
    });

    if (existingProject) {
      return NextResponse.json(
        { error: "Bu slug zaten kullanılıyor" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        slug,
        title,
        category,
        description,
        shortDesc,
        thumbnail,
        videoUrl,
        demoUrl,
        githubUrl,
        technologies: JSON.stringify(technologies || []),
        tags: JSON.stringify(tags || []),
        year: parseInt(year),
        duration,
        problem,
        solution,
        process,
        learnings,
        featured: featured || false,
        published: published !== false,
        publishedAt: published !== false ? new Date() : null,
        images: images?.length
          ? {
              create: images.map((img: any, index: number) => ({
                url: img.url,
                alt: img.alt || title,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
      },
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        userId: (session.user as any).id,
        action: "create",
        entity: "project",
        entityId: project.id,
        description: `Yeni proje oluşturuldu: ${title}`,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
