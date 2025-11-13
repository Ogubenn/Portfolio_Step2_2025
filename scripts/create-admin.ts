import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Email'i kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email: "admin@demo.com" },
    });

    if (existingUser) {
      console.log("✅ Admin kullanıcı zaten mevcut!");
      return;
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash("demo123", 10);

    // Admin kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        email: "admin@demo.com",
        password: hashedPassword,
        name: "Admin",
        role: "admin",
      },
    });

    console.log("✅ Admin kullanıcı başarıyla oluşturuldu!");
    console.log("📧 Email: admin@demo.com");
    console.log("🔑 Şifre: demo123");
    console.log("\n🚀 Giriş yapmak için: http://localhost:3000/admin/login");
  } catch (error) {
    console.error("❌ Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
