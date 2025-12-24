const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkProjects() {
  try {
    console.log('🔍 Tüm projeleri kontrol ediyorum...\n')
    
    const allProjects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        shortDesc: true,
        published: true,
        featured: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Toplam ${allProjects.length} proje bulundu:\n`)
    
    allProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`)
      console.log(`   Slug: ${project.slug}`)
      console.log(`   ShortDesc: "${project.shortDesc || 'BOŞ!'}"`)
      console.log(`   Published: ${project.published ? '✅ EVET' : '❌ HAYIR'}`)
      console.log(`   Featured: ${project.featured ? '⭐ EVET' : '   Hayır'}`)
      console.log(`   Oluşturulma: ${project.createdAt.toLocaleString('tr-TR')}`)
      console.log('')
    })

    const publishedCount = allProjects.filter(p => p.published).length
    const unpublishedCount = allProjects.filter(p => !p.published).length
    
    console.log('📊 Özet:')
    console.log(`   Yayında: ${publishedCount} proje ✅`)
    console.log(`   Taslak: ${unpublishedCount} proje ❌`)
    
    if (unpublishedCount > 0) {
      console.log('\n⚠️  Taslak (yayınlanmamış) projeler var!')
      console.log('   Bu projeler admin panelde görünür ama ana sayfada görünmez.')
      console.log('\n💡 Çözüm: Admin panelden projeyi düzenleyip "Yayınla" checkbox\'ını işaretleyin.')
    }

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProjects()
