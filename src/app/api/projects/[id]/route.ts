import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Tek bir proje
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Parse JSON fields
    const parsedProject = {
      ...project,
      technologies: project.technologies ? JSON.parse(project.technologies) : [],
      tags: project.tags ? JSON.parse(project.tags) : [],
    };

    return NextResponse.json(parsedProject);
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT - Proje güncelle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Slug kontrolü (kendi ID'si hariç)
    if (slug) {
      const existingProject = await prisma.project.findFirst({
        where: {
          slug,
          NOT: { id: params.id },
        },
      });

      if (existingProject) {
        return NextResponse.json(
          { error: "Bu slug zaten kullanılıyor" },
          { status: 400 }
        );
      }
    }

    // Mevcut resimleri sil ve yenilerini ekle
    if (images) {
      await prisma.projectImage.deleteMany({
        where: { projectId: params.id },
      });
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        ...(slug && { slug }),
        ...(title && { title }),
        ...(category && { category }),
        ...(description && { description }),
        ...(shortDesc && { shortDesc }),
        thumbnail: thumbnail || null,
        videoUrl: videoUrl || null,
        demoUrl: demoUrl || null,
        githubUrl: githubUrl || null,
        technologies: technologies ? JSON.stringify(technologies) : undefined,
        tags: tags ? JSON.stringify(tags) : undefined,
        year: year ? (typeof year === 'string' ? parseInt(year) : year) : undefined,
        duration: duration || null,
        problem: problem || null,
        solution: solution || null,
        process: process || null,
        learnings: learnings || null,
        featured: featured !== undefined ? featured : undefined,
        published: published !== undefined ? published : undefined,
        publishedAt: published && !body.publishedAt ? new Date() : undefined,
        images: images
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
        action: "update",
        entity: "project",
        entityId: project.id,
        description: `Proje güncellendi: ${title}`,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE - Proje sil
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Cascade delete - images otomatik silinir
    await prisma.project.delete({
      where: { id: params.id },
    });

    // Activity log
    await prisma.activityLog.create({
      data: {
        userId: (session.user as any).id,
        action: "delete",
        entity: "project",
        entityId: params.id,
        description: `Proje silindi: ${project.title}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
