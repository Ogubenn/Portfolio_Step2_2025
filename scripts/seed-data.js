const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function seedData() {
  try {
    console.log(' Örnek veriler ekleniyor...')

    // Site Settings
    console.log(' Site ayarları güncelleniyor...')
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {
        heroTitle: 'Merhaba, ben Kazım ',
        heroSubtitle: 'Tarım İşçisi & Doğa Tutkunu',
        heroCTA: 'Projelerimi İncele',
        aboutTitle: 'Hakkımda',
        aboutDescription: 'Toprağa kök salmış, doğayla iç içe yaşayan bir tarım işçisi',
        aboutBio1: 'Merhaba! Ben Kazım, toprakla haşır neşir, güneşin altında ter döken bir tarım işçisiyim. 20 yıldır bu işin içindeyim ve her gün doğanın mucizelerine tanık oluyorum.',
        aboutBio2: 'Organik tarım konusunda uzmanlaştım. Kimyasal gübre kullanmadan, doğal yöntemlerle en kaliteli ürünleri yetiştirmeyi öğrendim. Tohumdan hasada kadar her aşamayı titizlikle takip ediyorum.',
        aboutBio3: 'Genç nesillere tarım bilgisi aktarmak ve sürdürülebilir tarım için çalışmak benim en büyük tutkularım. Eğer siz de toprakla dost olmak istiyorsanız, benimle iletişime geçmekten çekinmeyin!',
        contactEmail: 'kazim.tarim@example.com',
        contactPhone: '+90 555 123 45 67',
        contactLocation: 'Konya, Türkiye',
        socialLinks: JSON.stringify({
          github: 'https://github.com/kazimtarim',
          linkedin: 'https://linkedin.com/in/kazimtarim'
        }),
        siteTitle: 'Kazım - Tarım İşçisi & Doğa Tutkunu',
        siteDescription: 'Organik tarım uzmanı Kazım\'ın kişisel web sitesi',
        siteKeywords: 'tarım, organik tarım, çiftçi, doğa, sürdürülebilirlik'
      },
      create: {
        id: 1,
        heroTitle: 'Merhaba, ben Kazım ',
        heroSubtitle: 'Tarım İşçisi & Doğa Tutkunu',
        heroCTA: 'Projelerimi İncele',
        aboutTitle: 'Hakkımda',
        aboutDescription: 'Toprağa kök salmış, doğayla iç içe yaşayan bir tarım işçisi',
        aboutBio1: 'Merhaba! Ben Kazım, toprakla haşır neşir, güneşin altında ter döken bir tarım işçisiyim. 20 yıldır bu işin içindeyim ve her gün doğanın mucizelerine tanık oluyorum.',
        aboutBio2: 'Organik tarım konusunda uzmanlaştım. Kimyasal gübre kullanmadan, doğal yöntemlerle en kaliteli ürünleri yetiştirmeyi öğrendim. Tohumdan hasada kadar her aşamayı titizlikle takip ediyorum.',
        aboutBio3: 'Genç nesillere tarım bilgisi aktarmak ve sürdürülebilir tarım için çalışmak benim en büyük tutkularım. Eğer siz de toprakla dost olmak istiyorsanız, benimle iletişime geçmekten çekinmeyin!',
        contactEmail: 'kazim.tarim@example.com',
        contactPhone: '+90 555 123 45 67',
        contactLocation: 'Konya, Türkiye',
        socialLinks: JSON.stringify({
          github: 'https://github.com/kazimtarim',
          linkedin: 'https://linkedin.com/in/kazimtarim'
        }),
        siteTitle: 'Kazım - Tarım İşçisi & Doğa Tutkunu',
        siteDescription: 'Organik tarım uzmanı Kazım\'ın kişisel web sitesi',
        siteKeywords: 'tarım, organik tarım, çiftçi, doğa, sürdürülebilirlik'
      }
    })

    // Skills
    console.log(' Yetenekler ekleniyor...')
    const skills = [
      { category: 'Tarım Becerileri', name: 'Organik Tarım', level: 95, order: 1 },
      { category: 'Tarım Becerileri', name: 'Toprak Analizi', level: 90, order: 2 },
      { category: 'Tarım Becerileri', name: 'Sulama Sistemleri', level: 85, order: 3 },
      { category: 'Tarım Becerileri', name: 'Hasat Teknikleri', level: 92, order: 4 },
      { category: 'Ekipman', name: 'Traktör Kullanımı', level: 88, order: 5 },
      { category: 'Ekipman', name: 'Modern Tarım Aletleri', level: 80, order: 6 },
      { category: 'Ekipman', name: 'Sera Teknolojisi', level: 75, order: 7 },
      { category: 'Bilgi', name: 'Bitki Hastalıkları', level: 87, order: 8 },
      { category: 'Bilgi', name: 'Gübre Yönetimi', level: 90, order: 9 },
      { category: 'Bilgi', name: 'İklim Takibi', level: 82, order: 10 }
    ]

    for (const skill of skills) {
      await prisma.skill.create({ data: { ...skill, visible: true } })
    }

    // Work Experience
    console.log(' İş deneyimleri ekleniyor...')
    const experiences = [
      {
        company: 'Yeşil Vadi Çiftliği',
        position: 'Baş Çiftçi',
        startDate: new Date('2020-01-01'),
        current: true,
        description: '500 dönümlük organik çiftlikte tüm tarımsal faaliyetleri yönetiyorum. 15 kişilik ekip liderliği yaparak organik sertifikalı ürünler yetiştiriyoruz.',
        location: 'Konya, Türkiye',
        type: 'Tam Zamanlı',
        order: 1
      },
      {
        company: 'Doğal Ürünler Kooperatifi',
        position: 'Tarım Danışmanı',
        startDate: new Date('2015-03-01'),
        endDate: new Date('2019-12-31'),
        current: false,
        description: 'Küçük çiftçilere organik tarım konusunda danışmanlık verdim. 50+ çiftçinin organik sertifika almasına yardımcı oldum.',
        location: 'Konya, Türkiye',
        type: 'Yarı Zamanlı',
        order: 2
      },
      {
        company: 'Anadolu Tarım A.Ş.',
        position: 'Tarım İşçisi',
        startDate: new Date('2010-06-01'),
        endDate: new Date('2015-02-28'),
        current: false,
        description: 'Sertifikalı tohum üretiminde çalıştım. Ekim, bakım ve hasat süreçlerinde aktif rol aldım.',
        location: 'Konya, Türkiye',
        type: 'Tam Zamanlı',
        order: 3
      }
    ]

    for (const exp of experiences) {
      await prisma.workExperience.create({ data: { ...exp, visible: true } })
    }

    // Services
    console.log(' Hizmetler ekleniyor...')
    const services = [
      {
        title: 'Organik Tarım Danışmanlığı',
        description: 'Organik tarıma geçiş sürecinde profesyonel destek ve rehberlik hizmeti sunuyorum.',
        icon: 'Leaf',
        features: JSON.stringify([
          'Toprak analizi ve iyileştirme',
          'Organik gübre yönetimi',
          'Sertifikasyon süreci desteği',
          'Ürün pazarlama stratejileri'
        ]),
        order: 1
      },
      {
        title: 'Sulama Sistem Kurulumu',
        description: 'Modern damla sulama ve yağmurlama sistemleri kurulumu ve bakım hizmetleri.',
        icon: 'Droplets',
        features: JSON.stringify([
          'Sistem tasarımı ve proje',
          'Kurulum ve montaj',
          'Periyodik bakım',
          'Enerji tasarrufu optimizasyonu'
        ]),
        order: 2
      },
      {
        title: 'Eğitim ve Seminerler',
        description: 'Tarım konusunda teorik ve pratik eğitimler, seminerler ve atölye çalışmaları düzenliyorum.',
        icon: 'GraduationCap',
        features: JSON.stringify([
          'Organik tarım eğitimleri',
          'Pratik arazi çalışmaları',
          'Seracılık eğitimi',
          'Sürdürülebilir tarım teknikleri'
        ]),
        order: 3
      }
    ]

    for (const service of services) {
      await prisma.service.create({ data: { ...service, visible: true } })
    }

    // Projects
    console.log(' Projeler ekleniyor...')
    const project1 = await prisma.project.create({
      data: {
        slug: 'organik-domates-serasi',
        title: 'Organik Domates Serası',
        category: 'tarım',
        description: 'Konya\'nın ilk tam organik sertifikalı domates serası projesi. 2000 m kapalı alanda yılda 50 ton organik domates üretimi.',
        shortDesc: 'Organik sertifikalı sera domatesçiliği projesi',
        technologies: JSON.stringify(['Sera Teknolojisi', 'Damla Sulama', 'Organik Gübre', 'Biyolojik Mücadele']),
        tags: JSON.stringify(['organik', 'sera', 'domates', 'sürdürülebilir']),
        year: 2023,
        duration: '12 ay',
        problem: 'Bölgede organik domates arzı yetersizdi ve kimyasal gübre kullanımı yüksekti. Tüketiciler sağlıklı, organik ürünlere ulaşmakta zorlanıyordu.',
        solution: 'Modern sera teknolojisi ile tam kontrollü ortamda organik domates üretimi başlattık. Damla sulama, biyolojik mücadele ve organik gübre kullanarak kimyasaldan tamamen arındırılmış üretim gerçekleştirdik.',
        process: 'İlk olarak toprak analizi yapıldı ve organik sertifikasyon süreci başlatıldı. Sera kurulumu tamamlandıktan sonra organik tohum temini yapıldı. Tüm üretim süreci organik tarım standartlarına göre yürütüldü.',
        learnings: 'Sera içi iklim kontrolünün önemi, biyolojik mücadelenin etkinliği ve organik gübreleme teknikleri konusunda derinlemesine deneyim kazandım.',
        featured: true,
        published: true,
        publishedAt: new Date()
      }
    })

    const project2 = await prisma.project.create({
      data: {
        slug: 'sulama-otomasyon-sistemi',
        title: 'Akıllı Sulama Otomasyon Sistemi',
        category: 'teknoloji',
        description: 'IoT tabanlı akıllı sulama sistemi ile su tüketiminde %40 tasarruf sağlandı. Toprak nem sensörleri ve hava durumu verilerini kullanarak otomatik sulama yapan sistem.',
        shortDesc: 'IoT tabanlı akıllı tarım sulama çözümü',
        technologies: JSON.stringify(['IoT Sensörler', 'Otomasyon', 'Damla Sulama', 'Veri Analizi']),
        tags: JSON.stringify(['otomasyon', 'sulama', 'teknoloji', 'tasarruf']),
        year: 2024,
        duration: '8 ay',
        problem: 'Geleneksel sulama yöntemleri ile su israfı ve verimsiz kullanım söz konusuydu. Manuel sulama işçilik maliyeti yüksekti.',
        solution: 'Toprak nem sensörleri, hava durumu tahmin sistemleri ve otomatik vana kontrolleri ile akıllı sulama sistemi kuruldu. Sistem, ihtiyaç olduğunda otomatik devreye giriyor.',
        process: 'Sensör yerleşimi planlandı, su hatları döşendi, kontrol ünitesi programlandı ve mobil uygulama entegrasyonu yapıldı. Test aşaması 2 ay sürdü.',
        learnings: 'IoT teknolojisinin tarımda kullanımı, veri analizi ile optimizasyon ve otomasyon sistemlerinin kurulumu konularında uzmanlaştım.',
        featured: true,
        published: true,
        publishedAt: new Date()
      }
    })

    const project3 = await prisma.project.create({
      data: {
        slug: 'kooperatif-egitim-programi',
        title: 'Köy Kooperatifi Eğitim Programı',
        category: 'eğitim',
        description: '250+ çiftçiye organik tarım, sürdürülebilirlik ve modern tarım teknikleri konularında kapsamlı eğitim programı.',
        shortDesc: 'Çiftçilere yönelik kapsamlı tarım eğitim programı',
        technologies: JSON.stringify(['Eğitim', 'Mentorluk', 'Pratik Uygulamalar', 'Sertifikasyon']),
        tags: JSON.stringify(['eğitim', 'kooperatif', 'organik', 'mentorluk']),
        year: 2022,
        duration: '18 ay',
        problem: 'Köylerdeki çiftçiler modern tarım tekniklerinden habersizdi ve verim düşüktü. Organik tarıma geçiş konusunda bilgi eksikliği vardı.',
        solution: 'Haftalık teorik ve pratik eğitimlerle çiftçilere modern tarım teknikleri öğretildi. Arazi ziyaretleri ve uygulamalı derslerle bilgi pekiştirildi.',
        process: 'Eğitim müfredatı hazırlandı, pilot grup seçildi, haftalık dersler başlatıldı. Her çiftçi kendi tarlasında bir pilot uygulama yaptı.',
        learnings: 'Eğitim metodolojisi, grup yönetimi ve bilgi transferi konularında değerli deneyimler edindim. İnsanlarla çalışmanın tarım kadar önemli olduğunu öğrendim.',
        featured: false,
        published: true,
        publishedAt: new Date()
      }
    })

    console.log('✅ Örnek veriler başarıyla eklendi!')
    console.log('📊 Eklenen Veriler:')
    console.log('- 1 Site Ayarı')
    console.log('- ' + skills.length + ' Yetenek')
    console.log('- ' + experiences.length + ' İş Deneyimi')
    console.log('- ' + services.length + ' Hizmet')
    console.log('- 3 Proje')
    console.log('')
    console.log('🌐 Siteyi görüntülemek için: http://localhost:3000')
    console.log('🔧 Admin panel: http://localhost:3000/admin')

  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedData()
