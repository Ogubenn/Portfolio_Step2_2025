import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing skills with invalid categories...\n');
  
  // "Tarım Becerileri" kategorisindeki tüm skills'i "Programlama Dilleri"ne taşı
  const result = await prisma.skill.updateMany({
    where: {
      category: 'Tarım Becerileri'
    },
    data: {
      category: 'Programlama Dilleri'
    }
  });
  
  console.log(`✅ ${result.count} skill kategorisi güncellendi`);
  
  // Diğer geçersiz kategorileri de kontrol et
  const allSkills = await prisma.skill.findMany();
  const validCategories = ['Programlama Dilleri', 'Framework\'ler', 'Araçlar', 'Diğer'];
  
  for (const skill of allSkills) {
    if (!validCategories.includes(skill.category)) {
      console.log(`⚠️  ${skill.name} - Geçersiz kategori: "${skill.category}"`);
      
      // Otomatik düzeltme
      await prisma.skill.update({
        where: { id: skill.id },
        data: { category: 'Diğer' }
      });
      console.log(`   → "Diğer" kategorisine taşındı`);
    }
  }
  
  console.log('\n✅ Tüm kategoriler güncellendi!');
  
  // Sonuç özeti
  const byCategory = await prisma.skill.groupBy({
    by: ['category'],
    _count: true
  });
  
  console.log('\nKategorilere göre dağılım:');
  byCategory.forEach(group => {
    console.log(`  ${group.category}: ${group._count} skill`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
