import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkAndFixAllProjects() {
  try {
    console.log("🔍 Scanning all projects for JSON issues...\n");

    const projects = await prisma.project.findMany();
    let fixedCount = 0;

    for (const project of projects) {
      let needsUpdate = false;
      let updatedData: any = {};

      console.log(`\n📦 Project: "${project.title}" (${project.id})`);
      console.log(`   Technologies RAW: ${project.technologies}`);
      console.log(`   Tags RAW: ${project.tags}`);

      // Check technologies
      try {
        const parsed = JSON.parse(project.technologies);
        console.log(`   ✅ Technologies parse OK:`, parsed);
      } catch (error: any) {
        console.log(`   ❌ Technologies BROKEN!`);
        console.log(`      Error: ${error.message}`);
        
        // Try to fix
        if (project.technologies.includes(',')) {
          const fixed = project.technologies.split(',').map(s => s.trim()).filter(Boolean);
          updatedData.technologies = JSON.stringify(fixed);
          console.log(`      🔧 Fixed to:`, fixed);
        } else {
          updatedData.technologies = JSON.stringify([]);
          console.log(`      🔧 Reset to empty array`);
        }
        needsUpdate = true;
      }

      // Check tags
      try {
        const parsed = JSON.parse(project.tags);
        console.log(`   ✅ Tags parse OK:`, parsed);
      } catch (error: any) {
        console.log(`   ❌ Tags BROKEN!`);
        console.log(`      Error: ${error.message}`);
        
        // Try to fix
        if (project.tags.includes(',')) {
          const fixed = project.tags.split(',').map(s => s.trim()).filter(Boolean);
          updatedData.tags = JSON.stringify(fixed);
          console.log(`      🔧 Fixed to:`, fixed);
        } else {
          updatedData.tags = JSON.stringify([]);
          console.log(`      🔧 Reset to empty array`);
        }
        needsUpdate = true;
      }

      // Update if needed
      if (needsUpdate) {
        await prisma.project.update({
          where: { id: project.id },
          data: updatedData,
        });
        fixedCount++;
        console.log(`   ✅ UPDATED in database`);
      }
    }

    console.log(`\n\n🎉 Summary: Fixed ${fixedCount} out of ${projects.length} projects`);
  } catch (error) {
    console.error("❌ Fatal Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFixAllProjects();
