import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkServices() {
  try {
    console.log("🔍 Checking services for JSON issues...\n");

    const services = await prisma.service.findMany();
    let fixedCount = 0;

    for (const service of services) {
      let needsUpdate = false;
      let updatedData: any = {};

      console.log(`\n📦 Service: "${service.title}" (${service.id})`);
      console.log(`   Features RAW: ${service.features}`);

      // Check features
      try {
        const parsed = JSON.parse(service.features);
        console.log(`   ✅ Features parse OK:`, parsed);
      } catch (error: any) {
        console.log(`   ❌ Features BROKEN!`);
        console.log(`      Error: ${error.message}`);
        
        // Try to fix
        if (service.features.includes(',')) {
          const fixed = service.features.split(',').map(s => s.trim()).filter(Boolean);
          updatedData.features = JSON.stringify(fixed);
          console.log(`      🔧 Fixed to:`, fixed);
        } else if (service.features.includes('\n')) {
          const fixed = service.features.split('\n').map(s => s.trim()).filter(Boolean);
          updatedData.features = JSON.stringify(fixed);
          console.log(`      🔧 Fixed to:`, fixed);
        } else {
          updatedData.features = JSON.stringify([service.features]);
          console.log(`      🔧 Wrapped in array:`, [service.features]);
        }
        needsUpdate = true;
      }

      // Update if needed
      if (needsUpdate) {
        await prisma.service.update({
          where: { id: service.id },
          data: updatedData,
        });
        fixedCount++;
        console.log(`   ✅ UPDATED in database`);
      }
    }

    console.log(`\n\n🎉 Summary: Fixed ${fixedCount} out of ${services.length} services`);
  } catch (error) {
    console.error("❌ Fatal Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkServices();
