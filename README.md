# 🚀 Profesyonel Portfolyo Web Sitesi

Modern, mobile-first, tamamen responsive ve SEO-friendly portfolyo web sitesi. Next.js 14 App Router, TypeScript ve Tailwind CSS ile geliştirilmiştir.

![Portfolio Preview](./public/preview.png)

> **Last Updated:** 4 Mart 2026 - Vercel Auto-Deploy Test

## Kurulum



```bash## ✨ Özellikler

npm install

npm run dev- ✅ **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS

```- ✅ **Mobile-First**: Responsive tasarım (320px - 1920px+)

- ✅ **Performans**: Lighthouse skoru 90+ (Performance, Accessibility, Best Practices)

Site: http://localhost:3000- ✅ **Animasyonlar**: Framer Motion ile akıcı animasyonlar

- ✅ **SEO Optimized**: Meta tags, Open Graph, Sitemap

## Özelleştirme- ✅ **Erişilebilirlik**: WCAG AA+ standartları, klavye navigasyonu

- ✅ **Dark Mode Ready**: (Opsiyonel olarak eklenebilir)

- **Projeler**: `src/data/projects.ts`- ✅ **Form Validation**: Honeypot ile spam koruması

- **Kişisel Bilgiler**: `src/components/sections/`- ✅ **Proje Filtreleme**: Kategori bazlı filtreleme sistemi

- **Sosyal Linkler**: `src/data/social.ts`

- **Videolar**: `public/projects/demo-video.mp4`## 📦 Kurulum



## Build### Gereksinimler



```bash- Node.js 18.0+

npm run build- npm 9.0+ veya yarn 1.22+

```

### Adımlar

1. **Depoyu klonlayın veya dosyaları indirin**

```bash
cd Step2
```

2. **Bağımlılıkları yükleyin**

```bash
npm install
# veya
yarn install
```

3. **Geliştirme sunucusunu başlatın**

```bash
npm run dev
# veya
yarn dev
```

4. **Tarayıcınızda açın**

```
http://localhost:3000
```

## 🎨 Özelleştirme

### 1. Kişisel Bilgilerinizi Güncelleyin

#### `src/app/layout.tsx`
- Site başlığı, açıklama ve metadata'yı güncelleyin
- İsminizi değiştirin

#### `src/data/social.ts`
- Sosyal medya linklerinizi ekleyin
- GitHub, LinkedIn, Email adreslerinizi güncelleyin

#### `src/data/navigation.ts`
- Menü linklerini özelleştirin (gerekirse)

### 2. Hero Bölümünü Özelleştirin

`src/components/sections/Hero.tsx` dosyasında:
- İsminizi ve unvanınızı değiştirin
- Kısa açıklamanızı güncelleyin
- İstatistikleri (yıl, proje sayısı) düzenleyin
- Profil fotoğrafınızı ekleyin

**Örnek Hero Başlıkları:**

```typescript
// Seçenek 1: Teknik ve Profesyonel
"Full-Stack Developer & Creative Problem Solver"

// Seçenek 2: Yaratıcı ve Samimi
"Kod Yazıyorum, Deneyimler Yaratıyorum"

// Seçenek 3: Sonuç Odaklı
"Fikirlerinizi Gerçek Ürünlere Dönüştürüyorum"
```

**Örnek Alt Başlıklar:**

```typescript
// Seçenek 1
"Kullanıcı deneyimini önceleyen, performanslı web ve oyun projeleri geliştiriyorum."

// Seçenek 2
"Modern teknolojilerle etkileyici dijital deneyimler oluşturuyorum."

// Seçenek 3
"React, TypeScript ve Next.js ile ölçeklenebilir web uygulamaları geliştiren deneyimli bir developer."
```

### 3. Hakkımda Bölümünü Güncelleyin

`src/components/sections/About.tsx` dosyasında kendi hikayenizi anlatın.

**Örnek "Hakkımda" Metinleri:**

#### One-Liner (Kısa)
```
"Full-stack developer olarak 3+ yıldır modern web teknolojileri ile kullanıcı odaklı çözümler üretiyorum."
```

#### Orta Uzunluk
```
Merhaba! Ben [İsminiz], Istanbul merkezli full-stack developer'ım. 
Web geliştirmeden oyun tasarımına kadar geniş bir yelpazede çalışıyorum. 
React, Next.js ve TypeScript ile modern, performanslı ve ölçeklenebilir 
uygulamalar geliştirmeyi seviyorum. Her projede öğrenmeyi ve 
sınırları zorlamayı hedefliyorum.
```

#### Uzun Versiyon
```
Merhaba! Ben [İsminiz], tam yığın geliştirici ve yaratıcı problem çözücüyüm. 
3+ yıldır web teknolojileri alanında çalışıyorum ve kullanıcı deneyimini 
ön planda tutan, performanslı ve güvenilir dijital ürünler geliştiriyorum.

Kariyerim boyunca e-ticaret platformlarından interaktif oyunlara, 
SaaS uygulamalarından mobil-uyumlu web sitelerine kadar geniş bir 
yelpazede projeler yönettim. React, Next.js, TypeScript ve modern 
CSS framework'leri ile çalışmayı seviyorum.

Her projede sadece kod yazmakla kalmıyor, kullanıcı araştırması, 
UI/UX tasarımı ve performans optimizasyonu gibi süreçlere de aktif 
olarak katılıyorum. İş birliğine ve açık iletişime inanıyorum.
```

### 4. Projelerinizi Ekleyin

`src/data/projects.ts` dosyasına kendi projelerinizi ekleyin:

```typescript
{
  id: '4', // Benzersiz ID
  slug: 'proje-url-adi', // URL'de görünecek
  title: 'Projenizin Adı',
  category: 'web', // web | game | mobile | tool | design
  shortDescription: 'Kısa açıklama (proje kartında görünür)',
  fullDescription: 'Detaylı açıklama (proje detay sayfasında)',
  role: 'Rolünüz',
  team: 'Ekip büyüklüğü',
  duration: 'Süre',
  year: '2024',
  technologies: ['React', 'TypeScript', '...'],
  tags: ['Web', 'SaaS', '...'],
  coverImage: '/projects/proje-kapak.jpg',
  images: ['/projects/img1.jpg', '/projects/img2.jpg'],
  demoUrl: 'https://demo.com',
  githubUrl: 'https://github.com/...',
  featured: true, // Öne çıkan proje
  problem: 'Hangi problemi çözdünüz?',
  solution: 'Nasıl çözdünüz?',
  results: [
    { metric: 'Metrik Adı', value: 'Değer', description: 'Açıklama' }
  ],
  learnings: ['Öğrendiğiniz şeyler...']
}
```

### 5. Görselleri Ekleyin

Tüm görselleri `public` klasörüne yerleştirin:

```
public/
├── og-image.jpg          # Open Graph görseli (1200x630px)
├── favicon.ico
├── apple-touch-icon.png
├── preview.png           # README için önizleme
└── projects/
    ├── neon-runner-cover.jpg
    ├── neon-runner-1.jpg
    └── ...
```

**Görsel Optimizasyonu:**
- WebP veya AVIF formatı kullanın
- Görselleri sıkıştırın (TinyPNG, Squoosh)
- Responsive boyutlar: 640px, 1024px, 1920px

### 6. İletişim Bilgilerini Güncelleyin

- `src/components/sections/Contact.tsx` - Form endpoint'i ekleyin
- `src/components/layout/Footer.tsx` - E-posta ve sosyal linkleri güncelleyin

## 🚀 Deployment (Yayınlama)

### Vercel (Önerilen)

1. GitHub'a push edin
2. [Vercel](https://vercel.com) hesabınıza giriş yapın
3. "New Project" → GitHub repo'nuzu seçin
4. Deploy! (Otomatik build ve deploy)

```bash
# Vercel CLI ile (alternatif)
npm install -g vercel
vercel
```

### Netlify

1. [Netlify](https://netlify.com) hesabınıza giriş yapın
2. "Add new site" → "Import from Git"
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### Manuel Build

```bash
# Production build
npm run build

# Oluşturulan dosyalar .next/ klasöründe
npm run start # Production sunucusu
```

## 📁 Proje Yapısı

```
Step2/
├── public/                 # Statik dosyalar
│   ├── projects/          # Proje görselleri
│   └── ...
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Ana sayfa
│   │   └── projects/      # Proje detay sayfaları
│   ├── components/
│   │   ├── layout/        # Header, Footer
│   │   ├── sections/      # Hero, About, Projects, etc.
│   │   └── ui/            # ProjectCard, Button, etc.
│   ├── data/              # Veri dosyaları
│   │   ├── projects.ts
│   │   ├── navigation.ts
│   │   └── social.ts
│   ├── styles/
│   │   └── globals.css    # Global stiller
│   └── types/
│       └── index.ts       # TypeScript tipleri
├── tailwind.config.js     # Tailwind yapılandırması
├── tsconfig.json          # TypeScript yapılandırması
├── next.config.js         # Next.js yapılandırması
├── package.json
├── DESIGN_SYSTEM.md       # Tasarım sistemi dokümantasyonu
├── WIREFRAME.md           # Wireframe ve sayfa yapıları
└── README.md
```

## 🎨 Renk Paleti

```css
/* Ana Renkler */
--color-primary-dark: #0A1628  /* Koyu Lacivert */
--color-primary: #1E3A5F       /* Ana Lacivert */

/* Vurgu Renkleri */
--color-accent-teal: #14B8A6   /* Turkuaz */

/* Nötr Renkler */
--color-neutral-50: #FAF9F7    /* Ekru */
--color-neutral-600: #4A4640   /* Koyu Gri */
```

Tam renk paleti için `DESIGN_SYSTEM.md` dosyasına bakın.

## 🛠️ Teknoloji Stack'i

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)
- **Deployment**: Vercel / Netlify

## ⚡ Performans Optimizasyonları

- Server-side rendering (SSR) ve Static Site Generation (SSG)
- Image optimization (WebP/AVIF)
- Lazy loading
- Code splitting
- Font preloading
- CSS purging (Tailwind)

## ♿ Erişilebilirlik

- Semantic HTML
- ARIA attributes
- Klavye navigasyonu
- Focus indicators
- WCAG AA+ kontrast oranları
- `prefers-reduced-motion` desteği

## 📊 Lighthouse Hedefleri

- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: 100

## 🤝 Katkıda Bulunma

Bu bir portfolyo template'idir. Kendi projeniz için özgürce kullanabilir ve özelleştirebilirsiniz.

## 📝 Lisans

MIT License - Kendi projelerinizde özgürce kullanın!

## 💬 Destek

Sorularınız için:
- GitHub Issues açabilirsiniz
- E-posta: your.email@example.com

---

**Made with ❤️ using Next.js, TypeScript & Tailwind CSS**
