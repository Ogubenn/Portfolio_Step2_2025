import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Email'i kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email: "ogulcan285@outlook.com" },
    });

    if (existingUser) {
      console.log("✅ Admin kullanıcı zaten mevcut!");
      console.log("📧 Email: ogulcan285@outlook.com");
      console.log("🔑 Şifre: 10031317534.Og");
      return;
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash("10031317534.Og", 10);

    // Admin kullanıcı oluştur
    const user = await prisma.user.create({
      data: {
        email: "ogulcan285@outlook.com",
        password: hashedPassword,
        name: "Oğulcan",
        role: "admin",
      },
    });

    console.log("✅ Admin kullanıcı başarıyla oluşturuldu!");
    console.log("📧 Email: ogulcan285@outlook.com");
    console.log("🔑 Şifre: 10031317534.Og");
    console.log("\n🚀 Giriş yapmak için: http://localhost:3000/admin/login");
  } catch (error) {
    console.error("❌ Hata:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
