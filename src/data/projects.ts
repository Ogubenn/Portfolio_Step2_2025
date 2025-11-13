import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: '1',
    slug: 'neon-runner',
    title: 'Neon Runner',
    category: 'game',
    shortDescription: 'Web tabanlı arcade-puzzle platformer oyunu. Retro pixel art stili ile modern web teknolojilerini birleştiren eğlenceli bir deneyim.',
    fullDescription: 'Neon Runner, nostaljik pixel art estetiğini modern web teknolojileri ile birleştiren hızlı tempolu bir platformer oyun. Oyuncular neon ışıklarla aydınlatılmış bir dünyada engellerden kaçarken puanlarını maksimize etmeye çalışır.',
    role: 'Lead Developer & Pixel Artist',
    team: '2 kişi',
    duration: '3 hafta',
    year: '2024',
    technologies: ['Unity', 'C#', 'WebGL', 'Aseprite', 'Git'],
    tags: ['2D', 'Arcade', 'Web Game', 'Pixel Art'],
    coverImage: '/projects/neon-runner-cover.jpg',
    images: [
      '/projects/neon-runner-1.jpg',
      '/projects/neon-runner-2.jpg',
      '/projects/neon-runner-3.jpg',
    ],
    demoUrl: 'https://demo.neon-runner.com',
    githubUrl: 'https://github.com/yourusername/neon-runner',
    featured: true,
    problem: 'Mobil cihazlar için optimize edilmiş, yüksek performanslı ve bağımlılık yaratacak kadar eğlenceli bir oyun deneyimi yaratmak gerekiyordu.',
    solution: 'Unity WebGL ile hafif ama görsel olarak etkileyici bir oyun mekanik geliştirdik. Pixel art stili ile hem nostaljik hem de modern bir estetik oluşturduk.',
    process: [
      {
        title: 'Research & Concept',
        description: 'Başarılı arcade oyunlarını analiz ettik ve hedef kitle araştırması yaptık. Oyun mekaniğini ve görsel stili belirledik.',
        image: '/process/neon-concept.jpg',
      },
      {
        title: 'Prototyping',
        description: 'Temel oyun mekaniğini Unity\'de prototipleştirdik. Oyun döngüsünü test edip iyileştirdik.',
      },
      {
        title: 'Art & Animation',
        description: 'Aseprite ile pixel art karakterler ve ortamlar oluşturduk. Akıcı animasyonlar ekledik.',
      },
      {
        title: 'Testing & Launch',
        description: 'Beta testleri yaptık, geri bildirimlere göre optimizasyonlar uyguladık ve yayınladık.',
      },
    ],
    results: [
      {
        metric: 'İndirme',
        value: '10,000+',
        description: 'İlk 2 haftada test indirmesi',
      },
      {
        metric: 'Dönüşüm',
        value: '%4',
        description: 'Hedefimiz %2 idi',
      },
      {
        metric: 'Memnuniyet',
        value: '4.7/5',
        description: 'Kullanıcı değerlendirmesi',
      },
    ],
    learnings: [
      'WebGL optimizasyonu mobil cihazlar için kritik öneme sahip',
      'Kullanıcı geri bildirimleri erken aşamalarda oyun deneyimini önemli ölçüde iyileştirebilir',
      'Pixel art stili performans ve estetik arasında mükemmel bir denge sağlıyor',
    ],
  },
  {
    id: '2',
    slug: 'ecommerce-dashboard',
    title: 'E-Commerce Dashboard',
    category: 'web',
    shortDescription: 'Modern ve sezgisel yönetim paneli. Gerçek zamanlı analitik, stok yönetimi ve sipariş takibi özellikleriyle donatılmış.',
    fullDescription: 'Küçük ve orta ölçekli işletmeler için tasarlanmış kapsamlı bir e-ticaret yönetim paneli. Satış analitikleri, envanter yönetimi ve müşteri ilişkileri yönetimi için tek platform.',
    role: 'Full-Stack Developer',
    team: '4 kişi',
    duration: '8 hafta',
    year: '2024',
    technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Prisma'],
    tags: ['Dashboard', 'Analytics', 'SaaS', 'Real-time'],
    coverImage: '/projects/dashboard-cover.jpg',
    images: [
      '/projects/dashboard-1.jpg',
      '/projects/dashboard-2.jpg',
      '/projects/dashboard-3.jpg',
    ],
    demoUrl: 'https://demo.ecommerce-dashboard.com',
    githubUrl: 'https://github.com/yourusername/ecommerce-dashboard',
    featured: true,
    problem: 'E-ticaret işletmeleri farklı platformlarda dağınık verileri yönetmekte zorlanıyordu. Tek bir merkezi yönetim paneline ihtiyaç vardı.',
    solution: 'Next.js 14 App Router ile server-side rendering ve gerçek zamanlı veri güncellemeleri sunan modern bir dashboard geliştirdik. Performans ve kullanıcı deneyimi odaklı bir arayüz tasarladık.',
    process: [
      {
        title: 'User Research',
        description: 'E-ticaret sahipleriyle görüşmeler yaptık ve mevcut çözümlerin eksiklerini belirledik.',
      },
      {
        title: 'Design System',
        description: 'Figma\'da kapsamlı bir tasarım sistemi oluşturduk. Component library ve style guide hazırladık.',
      },
      {
        title: 'Development',
        description: 'Next.js ile SSR/SSG destekli, SEO-friendly bir uygulama geliştirdik. API entegrasyonları ve real-time güncellemeler ekledik.',
      },
      {
        title: 'Testing & Optimization',
        description: 'Lighthouse skorlarını 90+ seviyesine çıkardık. Cross-browser testleri ve güvenlik denetimi yaptık.',
      },
    ],
    results: [
      {
        metric: 'Performans',
        value: '95/100',
        description: 'Lighthouse performans skoru',
      },
      {
        metric: 'Müşteri',
        value: '50+',
        description: 'İlk 3 ayda aktif müşteri',
      },
      {
        metric: 'Verimlilik',
        value: '%40',
        description: 'İş süreçlerinde hız artışı',
      },
    ],
    learnings: [
      'Server-side rendering SEO ve ilk yükleme hızında büyük fark yaratıyor',
      'Real-time güncellemeler kullanıcı memnuniyetini artırıyor',
      'TypeScript tip güvenliği büyük projelerde hata oranını azaltıyor',
    ],
  },
  {
    id: '3',
    slug: 'fitness-tracker-app',
    title: 'Fitness Tracker',
    category: 'web',
    shortDescription: 'Kişiselleştirilmiş egzersiz takip uygulaması. İlerleme grafikleri, hedef belirleme ve motivasyon sistemi ile donatılmış.',
    fullDescription: 'Kullanıcıların fitness hedeflerini takip etmelerini ve motive olmalarını sağlayan progresif web uygulaması. Özelleştirilebilir egzersiz planları ve sosyal özellikler içerir.',
    role: 'Full-Stack Developer & UI Designer',
    team: 'Solo proje',
    duration: '4 hafta',
    year: '2024',
    technologies: ['React', 'TypeScript', 'Firebase', 'Chart.js', 'PWA'],
    tags: ['PWA', 'Health', 'Mobile-First', 'Progressive Web App'],
    coverImage: '/projects/fitness-cover.jpg',
    images: [
      '/projects/fitness-1.jpg',
      '/projects/fitness-2.jpg',
      '/projects/fitness-3.jpg',
    ],
    demoUrl: 'https://demo.fitness-tracker.com',
    githubUrl: 'https://github.com/yourusername/fitness-tracker',
    featured: false,
    problem: 'Çoğu fitness uygulaması karmaşık ve pahalı. Kullanıcılar basit, ücretsiz ve etkili bir çözüm arıyor.',
    solution: 'Progressive Web App teknolojisiyle hem web hem mobil cihazlarda çalışan, offline desteği olan hafif bir uygulama geliştirdik.',
    process: [
      {
        title: 'Market Research',
        description: 'Mevcut fitness uygulamalarını analiz ettik ve kullanıcı ihtiyaçlarını belirledik.',
      },
      {
        title: 'MVP Development',
        description: 'Temel özellikleri içeren bir MVP geliştirdik ve erken kullanıcılardan geri bildirim topladık.',
      },
      {
        title: 'Feature Enhancement',
        description: 'Kullanıcı geri bildirimlerine göre yeni özellikler ekledik ve UX iyileştirmeleri yaptık.',
      },
    ],
    results: [
      {
        metric: 'Kullanıcı',
        value: '2,000+',
        description: 'Aktif kullanıcı sayısı',
      },
      {
        metric: 'Tutma',
        value: '%65',
        description: '30 günlük retention oranı',
      },
      {
        metric: 'Rating',
        value: '4.5/5',
        description: 'Ortalama kullanıcı puanı',
      },
    ],
    learnings: [
      'PWA teknolojisi native app deneyimine yakın performans sunuyor',
      'Gamification özellikleri kullanıcı bağlılığını artırıyor',
      'Basitlik bazen karmaşık özelliklerden daha değerli',
    ],
  },
  {
    id: '4',
    slug: 'mobile-expense-tracker',
    title: 'Expense Tracker',
    category: 'mobile',
    shortDescription: 'Akıllı harcama takip uygulaması. Otomatik kategorizasyon, bütçe uyarıları ve finansal raporlama özellikleri.',
    fullDescription: 'Kişisel finans yönetimini kolaylaştıran mobil uygulama. Harcamalarınızı takip edin, bütçe hedefleri belirleyin ve finansal sağlığınızı iyileştirin.',
    role: 'Mobile Developer',
    team: '3 kişi',
    duration: '6 hafta',
    year: '2024',
    technologies: ['React Native', 'TypeScript', 'Redux', 'SQLite', 'Firebase'],
    tags: ['Finance', 'Budget', 'Analytics', 'Cross-platform'],
    coverImage: '/projects/expense-cover.jpg',
    images: [
      '/projects/expense-1.jpg',
      '/projects/expense-2.jpg',
      '/projects/expense-3.jpg',
    ],
    demoUrl: 'https://apps.apple.com/expense-tracker',
    githubUrl: 'https://github.com/yourusername/expense-tracker',
    featured: false,
    problem: 'Kullanıcılar harcamalarını manuel olarak kaydetmek zorunda kalıyor ve bu sıkıcı bir süreç.',
    solution: 'Makine öğrenmesi ile otomatik kategorizasyon ve akıllı bildirimler içeren kullanıcı dostu bir mobil uygulama geliştirdik.',
    process: [
      {
        title: 'User Interviews',
        description: 'Kullanıcıların finansal takip alışkanlıklarını araştırdık.',
      },
      {
        title: 'Prototype',
        description: 'React Native ile cross-platform prototype geliştirdik.',
      },
      {
        title: 'Beta Testing',
        description: '100+ kullanıcı ile beta test yapıp geri bildirimlere göre iyileştirdik.',
      },
    ],
    results: [
      {
        metric: 'İndirme',
        value: '15,000+',
        description: 'İlk ayda indirme',
      },
      {
        metric: 'Rating',
        value: '4.6/5',
        description: 'App Store puanı',
      },
      {
        metric: 'Engagement',
        value: '%78',
        description: 'Günlük aktif kullanım',
      },
    ],
    learnings: [
      'React Native ile hem iOS hem Android için tek kod tabanı kullanmak geliştirme sürecini hızlandırdı',
      'Otomatik kategorizasyon kullanıcı deneyimini büyük ölçüde iyileştirdi',
      'Push notifications doğru kullanıldığında engagement\'ı artırıyor',
    ],
  },
  {
    id: '5',
    slug: 'code-snippet-manager',
    title: 'Snippet Manager',
    category: 'tool',
    shortDescription: 'Geliştiriciler için kod parçacığı yöneticisi. Hızlı arama, etiketleme ve takım işbirliği özellikleri.',
    fullDescription: 'Yazılım geliştiricilerin sık kullandığı kod parçacıklarını organize etmesini ve paylaşmasını sağlayan masaüstü uygulaması.',
    role: 'Full-Stack Developer',
    team: 'Solo proje',
    duration: '3 hafta',
    year: '2024',
    technologies: ['Electron', 'React', 'TypeScript', 'Monaco Editor', 'SQLite'],
    tags: ['Developer Tools', 'Desktop App', 'Productivity', 'Code Management'],
    coverImage: '/projects/snippet-cover.jpg',
    images: [
      '/projects/snippet-1.jpg',
      '/projects/snippet-2.jpg',
      '/projects/snippet-3.jpg',
    ],
    demoUrl: 'https://snippet-manager.app',
    githubUrl: 'https://github.com/yourusername/snippet-manager',
    featured: false,
    problem: 'Geliştiriciler sık kullandıkları kod parçacıklarını bulmakta zorlanıyor ve zaman kaybediyor.',
    solution: 'Hızlı arama, syntax highlighting ve takım paylaşımı özelliklerine sahip bir Electron uygulaması geliştirdik.',
    process: [
      {
        title: 'Developer Survey',
        description: 'Yazılımcıların kod snippet yönetimi ile ilgili ihtiyaçlarını araştırdık.',
      },
      {
        title: 'Desktop Development',
        description: 'Electron ile Windows, macOS ve Linux destekli uygulama geliştirdik.',
      },
      {
        title: 'Beta Launch',
        description: 'Developer topluluklarında beta sürümü yayınladık ve feedback topladık.',
      },
    ],
    results: [
      {
        metric: 'Kullanıcı',
        value: '5,000+',
        description: 'Aktif kullanıcı',
      },
      {
        metric: 'Snippet',
        value: '50,000+',
        description: 'Kaydedilen kod parçası',
      },
      {
        metric: 'Zaman',
        value: '%35',
        description: 'Kod yazma hızında artış',
      },
    ],
    learnings: [
      'Electron ile cross-platform desktop app geliştirmek düşündüğümüzden daha kolay',
      'Monaco Editor entegrasyonu profesyonel bir editing deneyimi sağlıyor',
      'Keyboard shortcuts power user\'lar için kritik',
    ],
  },
  {
    id: '6',
    slug: 'space-shooter-game',
    title: 'Galactic Defender',
    category: 'game',
    shortDescription: 'Uzay temalı retro shooter oyunu. Klasik arcade mekaniği ile modern grafikler bir arada.',
    fullDescription: 'Nostaljik space shooter oyunlarından ilham alan modern bir arcade oyun. Boss savaşları, güçlendirmeler ve skor tablosu özellikleri içerir.',
    role: 'Game Developer & Designer',
    team: '2 kişi',
    duration: '5 hafta',
    year: '2024',
    technologies: ['Unity', 'C#', 'Photoshop', 'FMOD', 'Steam SDK'],
    tags: ['Arcade', 'Shooter', '2D', 'Steam'],
    coverImage: '/projects/space-cover.jpg',
    images: [
      '/projects/space-1.jpg',
      '/projects/space-2.jpg',
      '/projects/space-3.jpg',
    ],
    demoUrl: 'https://store.steampowered.com/galactic-defender',
    githubUrl: 'https://github.com/yourusername/galactic-defender',
    featured: false,
    problem: 'Modern space shooter oyunları ya çok karmaşık ya da nostalji faktöründen yoksun.',
    solution: 'Klasik arcade mekaniğini modern grafikler ve ses tasarımı ile birleştirerek her yaştan oyuncuya hitap eden bir oyun yarattık.',
    process: [
      {
        title: 'Game Design',
        description: 'Oyun mekaniğini, level tasarımını ve düşman AI\'ını tasarladık.',
      },
      {
        title: 'Art & Sound',
        description: 'Pixel art grafikleri ve retro-futuristic müzik oluşturduk.',
      },
      {
        title: 'Steam Integration',
        description: 'Achievements, leaderboards ve Steam Cloud save entegre ettik.',
      },
    ],
    results: [
      {
        metric: 'Satış',
        value: '8,000+',
        description: 'İlk ayda satış',
      },
      {
        metric: 'Review',
        value: 'Çok Olumlu',
        description: 'Steam review skoru',
      },
      {
        metric: 'Playtime',
        value: '12 saat',
        description: 'Ortalama oyun süresi',
      },
    ],
    learnings: [
      'Steam entegrasyonu oyunun keşfedilebilirliğini artırıyor',
      'Leaderboard sistemi oyuncuları tekrar oynamaya teşvik ediyor',
      'Boss fight\'lar oyunun en unutulmaz anlarını oluşturuyor',
    ],
  },
  {
    id: '7',
    slug: 'restaurant-pos-system',
    title: 'QuickServe POS',
    category: 'web',
    shortDescription: 'Restoran yönetim sistemi. Sipariş takibi, masa yönetimi ve raporlama özellikleriyle donatılmış.',
    fullDescription: 'Restoranlar için tasarlanmış modern POS sistemi. Sipariş yönetimi, mutfak entegrasyonu ve detaylı satış raporları sunar.',
    role: 'Lead Developer',
    team: '5 kişi',
    duration: '10 hafta',
    year: '2024',
    technologies: ['Next.js', 'PostgreSQL', 'Prisma', 'WebSocket', 'Tailwind CSS'],
    tags: ['POS', 'Restaurant', 'Real-time', 'Business'],
    coverImage: '/projects/pos-cover.jpg',
    images: [
      '/projects/pos-1.jpg',
      '/projects/pos-2.jpg',
      '/projects/pos-3.jpg',
    ],
    demoUrl: 'https://demo.quickserve-pos.com',
    githubUrl: 'https://github.com/yourusername/quickserve-pos',
    featured: true,
    problem: 'Restoran sahipleri pahalı ve karmaşık POS sistemleri kullanmak zorunda kalıyor.',
    solution: 'Web tabanlı, uygun fiyatlı ve kullanımı kolay bir POS sistemi geliştirdik. Gerçek zamanlı sipariş takibi ve mutfak entegrasyonu sunuyor.',
    process: [
      {
        title: 'Restaurant Research',
        description: 'Restoran sahipleri ve personeli ile görüşmeler yaparak ihtiyaçları belirledik.',
      },
      {
        title: 'System Architecture',
        description: 'Scalable ve güvenilir bir sistem mimarisi tasarladık.',
      },
      {
        title: 'Real-time Features',
        description: 'WebSocket ile gerçek zamanlı sipariş güncellemeleri ekledik.',
      },
      {
        title: 'Testing & Deployment',
        description: 'Pilot restoranlarda test ettik ve geri bildirimlere göre optimize ettik.',
      },
    ],
    results: [
      {
        metric: 'Restoran',
        value: '25+',
        description: 'Aktif kullanıcı restoran',
      },
      {
        metric: 'Sipariş',
        value: '100,000+',
        description: 'İşlenen sipariş sayısı',
      },
      {
        metric: 'Verimlilik',
        value: '%50',
        description: 'Sipariş işleme hızında artış',
      },
    ],
    learnings: [
      'Real-time özellikleri restoran operasyonlarında kritik',
      'Touch-optimized UI hız ve kullanım kolaylığı sağlıyor',
      'Offline mode desteği güvenilirlik için şart',
    ],
  },
  {
    id: '8',
    slug: 'markdown-note-app',
    title: 'MarkNote',
    category: 'tool',
    shortDescription: 'Minimalist markdown not alma uygulaması. Hızlı, temiz ve odaklanmış yazma deneyimi.',
    fullDescription: 'Yazarlar ve geliştiriciler için tasarlanmış basit ama güçlü markdown editörü. Senkronizasyon, tagging ve export özellikleri içerir.',
    role: 'Solo Developer',
    team: 'Solo proje',
    duration: '2 hafta',
    year: '2024',
    technologies: ['Tauri', 'Svelte', 'TypeScript', 'CodeMirror', 'Rust'],
    tags: ['Notes', 'Markdown', 'Productivity', 'Desktop'],
    coverImage: '/projects/marknote-cover.jpg',
    images: [
      '/projects/marknote-1.jpg',
      '/projects/marknote-2.jpg',
    ],
    demoUrl: 'https://marknote.app',
    githubUrl: 'https://github.com/yourusername/marknote',
    featured: false,
    problem: 'Çoğu not alma uygulaması şişkin ve yavaş. Kullanıcılar basit ve hızlı bir çözüm istiyor.',
    solution: 'Tauri ile native performanslı, minimal bir markdown editörü geliştirdik. Sadece 10MB kurulum boyutu.',
    process: [
      {
        title: 'Tauri Learning',
        description: 'Rust ve Tauri framework öğrenerek performans avantajlarını keşfettik.',
      },
      {
        title: 'Rapid Development',
        description: 'MVP\'yi 1 haftada geliştirip erken feedback topladık.',
      },
    ],
    results: [
      {
        metric: 'İndirme',
        value: '3,000+',
        description: 'İlk 2 haftada',
      },
      {
        metric: 'Boyut',
        value: '10MB',
        description: 'Kurulum boyutu',
      },
      {
        metric: 'Hız',
        value: '<100ms',
        description: 'Başlatma süresi',
      },
    ],
    learnings: [
      'Tauri Electron\'a göre çok daha hafif ve hızlı',
      'Rust öğrenmek başta zordu ama performans kazancı buna değdi',
      'Minimal UI bazen daha iyi UX demek',
    ],
  },
]

// Kategori filtresi için yardımcı fonksiyonlar
export const getProjectsByCategory = (category: string) => {
  if (category === 'all') return projects
  return projects.filter((project) => project.category === category)
}

export const getFeaturedProjects = () => {
  return projects.filter((project) => project.featured)
}

export const getProjectBySlug = (slug: string) => {
  return projects.find((project) => project.slug === slug)
}

export const projectCategories = [
  { id: 'all', label: 'Tümü', count: projects.length },
  { id: 'web', label: 'Web', count: projects.filter(p => p.category === 'web').length },
  { id: 'game', label: 'Oyun', count: projects.filter(p => p.category === 'game').length },
  { id: 'mobile', label: 'Mobil', count: projects.filter(p => p.category === 'mobile').length },
  { id: 'tool', label: 'Araçlar', count: projects.filter(p => p.category === 'tool').length },
]
