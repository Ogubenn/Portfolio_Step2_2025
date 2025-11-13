import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mevcut projeler (src/data/projects.ts'den)
const projectsData = [
  {
    slug: "neon-runner",
    title: "Neon Runner",
    category: "game",
    description: "Neon Runner, nostaljik pixel art estetiğini modern web teknolojileri ile birleştiren hızlı tempolu bir platformer oyun. Oyuncular neon ışıklarla aydınlatılmış bir dünyada engellerden kaçarken puanlarını maksimize etmeye çalışır.",
    shortDesc: "Web tabanlı arcade-puzzle platformer oyunu. Retro pixel art stili ile modern web teknolojilerini birleştiren eğlenceli bir deneyim.",
    thumbnail: "/projects/neon-runner-cover.jpg",
    videoUrl: "/projects/demo-video.mp4",
    demoUrl: "https://demo.neon-runner.com",
    githubUrl: "https://github.com/yourusername/neon-runner",
    technologies: ["Unity", "C#", "WebGL", "Aseprite", "Git"],
    tags: ["2D", "Arcade", "Web Game", "Pixel Art"],
    year: 2024,
    duration: "3 hafta",
    problem: "Mobil cihazlar için optimize edilmiş, yüksek performanslı ve bağımlılık yaratacak kadar eğlenceli bir oyun deneyimi yaratmak gerekiyordu.",
    solution: "Unity WebGL ile hafif ama görsel olarak etkileyici bir oyun mekanik geliştirdik. Pixel art stili ile hem nostaljik hem de modern bir estetik oluşturduk.",
    process: "Research & Concept aşamasında başarılı arcade oyunlarını analiz ettik. Prototyping ile temel mekaniği oluşturduk. Art & Animation ile pixel art karakterler tasarladık. Testing & Launch ile beta testleri yapıp yayınladık.",
    learnings: "WebGL optimizasyonu mobil cihazlar için kritik öneme sahip. Kullanıcı geri bildirimleri erken aşamalarda oyun deneyimini önemli ölçüde iyileştirebilir. Pixel art stili performans ve estetik arasında mükemmel bir denge sağlıyor.",
    featured: true,
    published: true,
  },
  {
    slug: "ecommerce-dashboard",
    title: "E-Commerce Dashboard",
    category: "web",
    description: "Küçük ve orta ölçekli işletmeler için tasarlanmış kapsamlı bir e-ticaret yönetim paneli. Satış analitikleri, envanter yönetimi ve müşteri ilişkileri yönetimi için tek platform.",
    shortDesc: "Modern ve sezgisel yönetim paneli. Gerçek zamanlı analitik, stok yönetimi ve sipariş takibi özellikleriyle donatılmış.",
    thumbnail: "/projects/dashboard-cover.jpg",
    demoUrl: "https://demo.ecommerce-dashboard.com",
    githubUrl: "https://github.com/yourusername/ecommerce-dashboard",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Prisma"],
    tags: ["Dashboard", "Analytics", "SaaS", "Real-time"],
    year: 2024,
    duration: "8 hafta",
    problem: "E-ticaret işletmeleri farklı platformlarda dağınık verileri yönetmekte zorlanıyordu. Tek bir merkezi yönetim paneline ihtiyaç vardı.",
    solution: "Next.js 14 App Router ile server-side rendering ve gerçek zamanlı veri güncellemeleri sunan modern bir dashboard geliştirdik. Performans ve kullanıcı deneyimi odaklı bir arayüz tasarladık.",
    process: "User Research ile e-ticaret sahipleriyle görüşmeler yaptık. Design System oluşturduk. Development aşamasında Next.js ile SSR/SSG destekli uygulama geliştirdik. Testing & Optimization ile Lighthouse skorlarını 90+ seviyesine çıkardık.",
    learnings: "Server-side rendering SEO ve ilk yükleme hızında büyük fark yaratıyor. Real-time güncellemeler kullanıcı memnuniyetini artırıyor. TypeScript tip güvenliği büyük projelerde hata oranını azaltıyor.",
    featured: true,
    published: true,
  },
  {
    slug: "fitness-tracker-app",
    title: "Fitness Tracker",
    category: "web",
    description: "Kullanıcıların fitness hedeflerini takip etmelerini ve motive olmalarını sağlayan progresif web uygulaması. Özelleştirilebilir egzersiz planları ve sosyal özellikler içerir.",
    shortDesc: "Kişiselleştirilmiş egzersiz takip uygulaması. İlerleme grafikleri, hedef belirleme ve motivasyon sistemi ile donatılmış.",
    thumbnail: "/projects/fitness-cover.jpg",
    demoUrl: "https://demo.fitness-tracker.com",
    githubUrl: "https://github.com/yourusername/fitness-tracker",
    technologies: ["React", "TypeScript", "Firebase", "Chart.js", "PWA"],
    tags: ["PWA", "Health", "Mobile-First", "Progressive Web App"],
    year: 2024,
    duration: "4 hafta",
    problem: "Çoğu fitness uygulaması karmaşık ve pahalı. Kullanıcılar basit, ücretsiz ve etkili bir çözüm arıyor.",
    solution: "Progressive Web App teknolojisiyle hem web hem mobil cihazlarda çalışan, offline desteği olan hafif bir uygulama geliştirdik.",
    process: "Market Research ile mevcut fitness uygulamalarını analiz ettik. MVP Development ile temel özellikleri içeren bir MVP geliştirdik. Feature Enhancement ile kullanıcı geri bildirimlerine göre yeni özellikler ekledik.",
    learnings: "PWA teknolojisi native app deneyimine yakın performans sunuyor. Gamification özellikleri kullanıcı bağlılığını artırıyor. Basitlik bazen karmaşık özelliklerden daha değerli.",
    featured: false,
    published: true,
  },
  {
    slug: "mobile-expense-tracker",
    title: "Expense Tracker",
    category: "mobile",
    description: "Kişisel finans yönetimini kolaylaştıran mobil uygulama. Harcamalarınızı takip edin, bütçe hedefleri belirleyin ve finansal sağlığınızı iyileştirin.",
    shortDesc: "Akıllı harcama takip uygulaması. Otomatik kategorizasyon, bütçe uyarıları ve finansal raporlama özellikleri.",
    thumbnail: "/projects/expense-cover.jpg",
    demoUrl: "https://apps.apple.com/expense-tracker",
    githubUrl: "https://github.com/yourusername/expense-tracker",
    technologies: ["React Native", "TypeScript", "Redux", "SQLite", "Firebase"],
    tags: ["Finance", "Budget", "Analytics", "Cross-platform"],
    year: 2024,
    duration: "6 hafta",
    problem: "Kullanıcılar harcamalarını manuel olarak kaydetmek zorunda kalıyor ve bu sıkıcı bir süreç.",
    solution: "Makine öğrenmesi ile otomatik kategorizasyon ve akıllı bildirimler içeren kullanıcı dostu bir mobil uygulama geliştirdik.",
    process: "User Interviews ile kullanıcıların finansal takip alışkanlıklarını araştırdık. Prototype geliştirdik. Beta Testing ile 100+ kullanıcı ile test yapıp iyileştirdik.",
    learnings: "React Native ile hem iOS hem Android için tek kod tabanı kullanmak geliştirme sürecini hızlandırdı. Otomatik kategorizasyon kullanıcı deneyimini büyük ölçüde iyileştirdi. Push notifications doğru kullanıldığında engagement'ı artırıyor.",
    featured: false,
    published: true,
  },
  {
    slug: "code-snippet-manager",
    title: "Snippet Manager",
    category: "tool",
    description: "Yazılım geliştiricilerin sık kullandığı kod parçacıklarını organize etmesini ve paylaşmasını sağlayan masaüstü uygulaması.",
    shortDesc: "Geliştiriciler için kod parçacığı yöneticisi. Hızlı arama, etiketleme ve takım işbirliği özellikleri.",
    thumbnail: "/projects/snippet-cover.jpg",
    demoUrl: "https://snippet-manager.app",
    githubUrl: "https://github.com/yourusername/snippet-manager",
    technologies: ["Electron", "React", "TypeScript", "Monaco Editor", "SQLite"],
    tags: ["Developer Tools", "Desktop App", "Productivity", "Code Management"],
    year: 2024,
    duration: "3 hafta",
    problem: "Geliştiriciler sık kullandıkları kod parçacıklarını bulmakta zorlanıyor ve zaman kaybediyor.",
    solution: "Hızlı arama, syntax highlighting ve takım paylaşımı özelliklerine sahip bir Electron uygulaması geliştirdik.",
    process: "Developer Survey ile yazılımcıların ihtiyaçlarını araştırdık. Desktop Development ile cross-platform uygulama geliştirdik. Beta Launch ile developer topluluklarında yayınladık.",
    learnings: "Electron ile cross-platform desktop app geliştirmek düşündüğümüzden daha kolay. Monaco Editor entegrasyonu profesyonel bir editing deneyimi sağlıyor. Keyboard shortcuts power user'lar için kritik.",
    featured: false,
    published: true,
  },
  {
    slug: "space-shooter-game",
    title: "Galactic Defender",
    category: "game",
    description: "Nostaljik space shooter oyunlarından ilham alan modern bir arcade oyun. Boss savaşları, güçlendirmeler ve skor tablosu özellikleri içerir.",
    shortDesc: "Uzay temalı retro shooter oyunu. Klasik arcade mekaniği ile modern grafikler bir arada.",
    thumbnail: "/projects/space-cover.jpg",
    demoUrl: "https://store.steampowered.com/galactic-defender",
    githubUrl: "https://github.com/yourusername/galactic-defender",
    technologies: ["Unity", "C#", "Photoshop", "FMOD", "Steam SDK"],
    tags: ["Arcade", "Shooter", "2D", "Steam"],
    year: 2024,
    duration: "5 hafta",
    problem: "Modern space shooter oyunları ya çok karmaşık ya da nostalji faktöründen yoksun.",
    solution: "Klasik arcade mekaniğini modern grafikler ve ses tasarımı ile birleştirerek her yaştan oyuncuya hitap eden bir oyun yarattık.",
    process: "Game Design ile oyun mekaniğini tasarladık. Art & Sound ile pixel art grafikleri oluşturduk. Steam Integration ile achievements ve leaderboards entegre ettik.",
    learnings: "Steam entegrasyonu oyunun keşfedilebilirliğini artırıyor. Leaderboard sistemi oyuncuları tekrar oynamaya teşvik ediyor. Boss fight'lar oyunun en unutulmaz anlarını oluşturuyor.",
    featured: false,
    published: true,
  },
  {
    slug: "restaurant-pos-system",
    title: "QuickServe POS",
    category: "web",
    description: "Restoranlar için tasarlanmış modern POS sistemi. Sipariş yönetimi, mutfak entegrasyonu ve detaylı satış raporları sunar.",
    shortDesc: "Restoran yönetim sistemi. Sipariş takibi, masa yönetimi ve raporlama özellikleriyle donatılmış.",
    thumbnail: "/projects/pos-cover.jpg",
    demoUrl: "https://demo.quickserve-pos.com",
    githubUrl: "https://github.com/yourusername/quickserve-pos",
    technologies: ["Next.js", "PostgreSQL", "Prisma", "WebSocket", "Tailwind CSS"],
    tags: ["POS", "Restaurant", "Real-time", "Business"],
    year: 2024,
    duration: "10 hafta",
    problem: "Restoran sahipleri pahalı ve karmaşık POS sistemleri kullanmak zorunda kalıyor.",
    solution: "Web tabanlı, uygun fiyatlı ve kullanımı kolay bir POS sistemi geliştirdik. Gerçek zamanlı sipariş takibi ve mutfak entegrasyonu sunuyor.",
    process: "Restaurant Research ile restoran sahipleri ile görüşmeler yaptık. System Architecture tasarladık. Real-time Features ile WebSocket entegrasyonu ekledik. Testing & Deployment ile pilot restoranlarda test ettik.",
    learnings: "Real-time özellikleri restoran operasyonlarında kritik. Touch-optimized UI hız ve kullanım kolaylığı sağlıyor. Offline mode desteği güvenilirlik için şart.",
    featured: true,
    published: true,
  },
  {
    slug: "markdown-note-app",
    title: "MarkNote",
    category: "tool",
    description: "Yazarlar ve geliştiriciler için tasarlanmış basit ama güçlü markdown editörü. Senkronizasyon, tagging ve export özellikleri içerir.",
    shortDesc: "Minimalist markdown not alma uygulaması. Hızlı, temiz ve odaklanmış yazma deneyimi.",
    thumbnail: "/projects/marknote-cover.jpg",
    demoUrl: "https://marknote.app",
    githubUrl: "https://github.com/yourusername/marknote",
    technologies: ["Tauri", "Svelte", "TypeScript", "CodeMirror", "Rust"],
    tags: ["Notes", "Markdown", "Productivity", "Desktop"],
    year: 2024,
    duration: "2 hafta",
    problem: "Çoğu not alma uygulaması şişkin ve yavaş. Kullanıcılar basit ve hızlı bir çözüm istiyor.",
    solution: "Tauri ile native performanslı, minimal bir markdown editörü geliştirdik. Sadece 10MB kurulum boyutu.",
    process: "Tauri Learning ile Rust ve Tauri framework öğrendik. Rapid Development ile MVP'yi 1 haftada geliştirdik.",
    learnings: "Tauri Electron'a göre çok daha hafif ve hızlı. Rust öğrenmek başta zordu ama performans kazancı buna değdi. Minimal UI bazen daha iyi UX demek.",
    featured: false,
    published: true,
  },
];

async function migrateProjects() {
  console.log("🚀 Proje migration başlıyor...\n");

  try {
    // Mevcut projeleri kontrol et
    const existingCount = await prisma.project.count();
    
    if (existingCount > 0) {
      console.log(`⚠️  Database'de zaten ${existingCount} proje var.`);
      console.log("Devam etmek için tüm projeleri silecek. Emin misiniz? (Ctrl+C ile iptal)\n");
      
      // 3 saniye bekle
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log("Mevcut projeler siliniyor...");
      await prisma.project.deleteMany({});
      console.log("✅ Silme tamamlandı\n");
    }

    let successCount = 0;
    let errorCount = 0;

    for (const projectData of projectsData) {
      try {
        const project = await prisma.project.create({
          data: {
            slug: projectData.slug,
            title: projectData.title,
            category: projectData.category,
            description: projectData.description,
            shortDesc: projectData.shortDesc,
            thumbnail: projectData.thumbnail,
            videoUrl: projectData.videoUrl,
            demoUrl: projectData.demoUrl,
            githubUrl: projectData.githubUrl,
            technologies: JSON.stringify(projectData.technologies),
            tags: JSON.stringify(projectData.tags),
            year: projectData.year,
            duration: projectData.duration,
            problem: projectData.problem,
            solution: projectData.solution,
            process: projectData.process,
            learnings: projectData.learnings,
            featured: projectData.featured,
            published: projectData.published,
            publishedAt: projectData.published ? new Date() : null,
          },
        });

        console.log(`✅ ${project.title} eklendi`);
        successCount++;
      } catch (error) {
        console.error(`❌ ${projectData.title} eklenirken hata:`, error);
        errorCount++;
      }
    }

    console.log("\n🎉 Migration tamamlandı!");
    console.log(`✅ Başarılı: ${successCount}`);
    if (errorCount > 0) {
      console.log(`❌ Hatalı: ${errorCount}`);
    }

    // İstatistikler
    const stats = {
      total: await prisma.project.count(),
      featured: await prisma.project.count({ where: { featured: true } }),
      published: await prisma.project.count({ where: { published: true } }),
      web: await prisma.project.count({ where: { category: "web" } }),
      game: await prisma.project.count({ where: { category: "game" } }),
      mobile: await prisma.project.count({ where: { category: "mobile" } }),
      tool: await prisma.project.count({ where: { category: "tool" } }),
    };

    console.log("\n📊 Database İstatistikleri:");
    console.log(`Toplam Proje: ${stats.total}`);
    console.log(`Öne Çıkan: ${stats.featured}`);
    console.log(`Yayında: ${stats.published}`);
    console.log(`Web: ${stats.web} | Oyun: ${stats.game} | Mobil: ${stats.mobile} | Araç: ${stats.tool}`);

  } catch (error) {
    console.error("❌ Migration hatası:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateProjects();
