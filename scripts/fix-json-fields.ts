import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function fixJsonFields() {
  try {
    console.log("🔍 Checking projects for invalid JSON...");

    const projects = await prisma.project.findMany();
    let fixedCount = 0;

    for (const project of projects) {
      let needsUpdate = false;
      let updatedData: any = {};

      // Check technologies
      try {
        if (project.technologies) {
          JSON.parse(project.technologies);
          console.log(`✅ ${project.title} - technologies OK`);
        }
      } catch (error) {
        console.log(`❌ ${project.title} - technologies BROKEN: ${project.technologies}`);
        // Fix: wrap in array if not already
        updatedData.technologies = JSON.stringify([]);
        needsUpdate = true;
      }

      // Check tags
      try {
        if (project.tags) {
          JSON.parse(project.tags);
          console.log(`✅ ${project.title} - tags OK`);
        }
      } catch (error) {
        console.log(`❌ ${project.title} - tags BROKEN: ${project.tags}`);
        updatedData.tags = JSON.stringify([]);
        needsUpdate = true;
      }

      // Update if needed
      if (needsUpdate) {
        await prisma.project.update({
          where: { id: project.id },
          data: updatedData,
        });
        fixedCount++;
        console.log(`🔧 Fixed: ${project.title}`);
      }
    }

    console.log(`\n✅ Fixed ${fixedCount} projects`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixJsonFields();
