import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteOldAdmin() {
  try {
    await prisma.user.deleteMany({
      where: { 
        email: "admin@demo.com" 
      }
    });
    console.log("✅ Eski admin kullanıcı silindi!");
  } catch (error) {
    console.error("❌ Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteOldAdmin();
