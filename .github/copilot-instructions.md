# Portfolio Admin Panel - AI Agent Instructions

## Mimari Genel Bakış

**Next.js 14 App Router + Prisma ORM + MySQL Full-Stack Portfolio Yönetim Sistemi**

Bu proje hem statik bir portfolio frontend'i hem de tam özellikli bir admin paneli içerir. İki katmanlı mimari:
1. **Public Routes** (`/`, `/projects/[slug]`) - SSR ile render edilen portfolio sitesi
2. **Admin Panel** (`/admin/*`) - NextAuth.js ile korunan CRUD yönetim paneli

## Kritik Kararlar & Konvansiyonlar

### 1. Zero-Cache Architecture
**Tüm admin değişiklikleri anında homepage'de yansır**

```typescript
// Tüm API route'larında ve page'lerde zorunlu
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Response header'larında
response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
```

**Neden:** Admin panelden yapılan değişiklikler cache'siz SSR sayesinde anında görünür. ISR/SSG kullanmıyoruz.

Örnekler: `src/app/api/public/*/route.ts`, `src/app/layout.tsx`

### 2. Database Schema Özellikleri

**Prisma with MySQL (DirectAdmin barındırma ortamı)**

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma" // Önemli: Foreign key'leri Prisma seviyesinde yönetir
}
```

**9 Ana Model:**
- `User` - Admin authentication (bcrypt hashed passwords)
- `Project` - Portfolio projeleri (slug-based routing, multiple images)
- `ProjectImage` - Proje galeri resimleri (one-to-many with cascade delete)
- `Skill` - Kategorize yetenekler (Languages/Frameworks/Tools/Other)
- `WorkExperience` - İş deneyimi timeline
- `Service` - Hizmet kartları
- `SiteSettings` - **Singleton model** (id=1, sadece update/upsert)
- `ActivityLog` - Tüm CRUD işlemlerinin audit trail'i
- `Media` - (Şu an kullanılmıyor, file management planlanıyor)

**Migration Komutları:**
```bash
npx prisma migrate dev --name description  # Development
npx prisma migrate deploy                   # Production
npx prisma generate                          # Client regenerate
```

### 3. Authentication & Authorization

**NextAuth.js + Credentials Provider**

- Login: `/admin/login` (email/password)
- Protected routes: `/admin/*` (except `/admin/login`)
- Middleware: `src/middleware.ts` - tüm `/admin/:path` route'larını korur
- Session: JWT-based, 30 gün expire
- Varsayılan credentials: `admin@demo.com` / `demo123`

**Admin oluşturma scripti:**
```bash
npx tsx scripts/create-admin.ts
```

### 4. Activity Logging Pattern

**Tüm CRUD işlemleri otomatik loglanır:**

```typescript
await prisma.activityLog.create({
  data: {
    action: 'create',        // create | update | delete
    entity: 'project',        // project | skill | experience | service | settings
    entityId: project.id,
    description: 'Yeni proje eklendi: ${project.title}',
    metadata: JSON.stringify({ slug: project.slug })
  }
})
```

Admin dashboard (`/admin`) son 5 aktiviteyi gösterir. API: `GET /api/activity?limit=5`

### 5. File Upload Stratejisi

⚠️ **KRİTİK:** Vercel ephemeral filesystem - dosyalar deploy sonrası silinir!

**Mevcut durumu:**
- `src/app/api/upload/route.ts` - Local `public/` klasörüne yazar (geliştirme için)
- Desteklenen: images (20MB), videos (541MB), documents (50MB)
- Klasör yapısı: `public/projects/thumbnails/`, `public/images/hero/`, `public/files/cv/`

**TODO List öncelik #1:** Cloudinary entegrasyonu
- Şu an local filesystem kullanımı production'da çalışmaz
- File upload formları mevcut ama Vercel deploy'da problem yaşar

### 6. Public API Endpoints

Frontend için cache-free data endpoints:

```typescript
GET /api/public/projects      // Published projeler
GET /api/public/projects/[slug]  // Tek proje detayı
GET /api/public/skills         // Visible skills
GET /api/public/experience     // Visible experience
GET /api/public/services       // Visible services
GET /api/public/settings       // Site settings (singleton)
```

**Always returns 200 with default data if DB empty** - frontend crash'i önler.

### 7. Admin CRUD Pattern

**Consistent naming convention:**
```
GET    /api/[entity]         -> List all
POST   /api/[entity]         -> Create new
GET    /api/[entity]/[id]    -> Get single (opsiyonel, çoğunda yok)
PUT    /api/[entity]/[id]    -> Update
DELETE /api/[entity]/[id]    -> Delete
```

**Özel durum - Site Settings:**
```typescript
PUT /api/settings  // Upsert { where: { id: 1 }, create: {...}, update: {...} }
```
Singleton olduğu için sadece update, id her zaman 1.

### 8. JSON Field Pattern

Bazı field'lar JSON string olarak saklanır:

```typescript
// Database'de: VARCHAR/TEXT
technologies: string  // ['React', 'TypeScript']
tags: string          // ['Web', 'SaaS']
socialLinks: string   // {github: "...", linkedin: "..."}
features: string      // ['Feature 1', 'Feature 2']

// API'de parse/stringify edilir
const technologies = JSON.parse(project.technologies)
await prisma.project.create({
  data: { technologies: JSON.stringify(techArray) }
})
```

### 9. Frontend Component Data Flow

```typescript
// Server Component (page.tsx)
const settings = await fetch('/api/public/settings').then(r => r.json())
const skills = await fetch('/api/public/skills').then(r => r.json())

// Client Component
<About settings={settings} skills={skills} />
```

**Key components:**
- `src/components/sections/Hero.tsx` - SiteSettings heroTitle, heroBio
- `src/components/sections/About.tsx` - Skills gruplandırma, experience timeline
- `src/components/sections/Projects.tsx` - Client-side kategori filtreleme
- `src/components/sections/Services.tsx` - Services kartları

### 10. Development Workflow

**Build & Run:**
```bash
npm install
npx prisma generate     # İlk kurulumda mutlaka
npm run dev             # http://localhost:3000
```

**Database operations:**
```bash
# Migration oluştur
npx prisma migrate dev --name add_new_field

# Prisma Studio (GUI)
npx prisma studio       # http://localhost:5555

# Database seed (varsa)
npx tsx scripts/seed-data.js
```

**Admin access:**
1. `http://localhost:3000/admin/login`
2. Email: `admin@demo.com`, Password: `demo123`
3. Eğer kullanıcı yoksa: `npx tsx scripts/create-admin.ts`

### 11. Styling Conventions

**Tailwind CSS + Custom Design Tokens**

```css
/* Primary colors */
--color-accent-electric: #14B8A6  /* Turkuaz */
--color-accent-purple: #A855F7
--color-accent-pink: #EC4899

/* Semantic classes (src/styles/globals.css) */
.btn-primary       /* Gradient button */
.card              /* Content kartları */
.section-padding   /* Section spacing */
```

**Admin panel:** Dark theme (gray-800, gray-900 backgrounds)
**Frontend:** Light theme + dark mode hazır (şu an kullanılmıyor)

### 12. Type Safety

```typescript
// src/types/index.ts - merkezi tip tanımları
export interface Project {
  id: string
  slug: string
  title: string
  // ... (Prisma model ile match etmeli)
}
```

**Type generation:**
- Prisma types: `@prisma/client` (auto-generated)
- Frontend types: Manual `src/types/index.ts`
- TODO: Prisma'dan type'ları export et (duplicate önler)

---

## Sık Kullanılan Script'ler

```bash
# Admin kullanıcı oluştur
npx tsx scripts/create-admin.ts

# Eski admin'leri sil
npx tsx scripts/delete-old-admin.ts

# Projeleri migrate et (eski data/projects.ts → DB)
npx tsx scripts/migrate-projects.ts

# DB durumunu kontrol et
npx tsx scripts/check-projects.js
```

---

## Bilinen Kısıtlamalar & TODO'lar

1. **File upload production'da çalışmaz** - Cloudinary gerekli (TODO.md #1 öncelik)
2. **No image optimization** - `<img>` yerine `next/image` kullan
3. **Skills UI küçük** - Badge boyutları büyütülmeli (TODO.md design section)
4. **No rich text editor** - Description'lar plain text (Tiptap/Lexical planlanıyor)
5. **Single admin role** - Role-based permissions yok (gelecek özellik)

---

## Önemli Dosya Referansları

| Dosya | Amaç |
|-------|------|
| `prisma/schema.prisma` | Database schema tanımları |
| `src/lib/auth.ts` | NextAuth configuration |
| `src/middleware.ts` | Admin route protection |
| `src/lib/prisma.ts` | Prisma singleton client |
| `TODO.md` | Güncel feature roadmap |
| `DATABASE_SETUP.md` | DirectAdmin DB kurulum rehberi |

---

**Son Güncelleme:** 1 Aralık 2025
