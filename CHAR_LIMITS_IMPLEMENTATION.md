# Karakter Limiti İyileştirmeleri

## ✅ Tamamlanan İşlemler

### 1. **CharacterCounter Component Oluşturuldu**
`src/components/ui/CharacterCounter.tsx`

**3 adet re-usable component:**
- `CharacterCounter` - Sadece sayaç gösterimi (80% sarı, >100% kırmızı)
- `TextInputWithCounter` - Input + karakter sayacı
- `TextAreaWithCounter` - Textarea + karakter sayacı

**Özellikler:**
- Otomatik renk kodlama (gri → sarı → kırmızı)
- maxLength enforcement
- "X karakter fazla" uyarısı
- Helper text desteği

### 2. **CHAR_LIMITS Constants**
`src/lib/constants.ts`

| Field Type | Limit | Kullanım |
|------------|-------|----------|
| TITLE | 191 | Başlıklar, isimler |
| SUBTITLE | 500 | Alt başlıklar, kısa açıklamalar |
| SHORT_DESC | 500 | Proje özet açıklamaları |
| BIO | 5000 | Biyografi paragrafları |
| DESCRIPTION | 5000 | Genel açıklamalar |
| CONTENT | 10000 | Uzun içerikler (problem/solution) |

### 3. **Prisma Schema Güncellendi**
`prisma/schema.prisma`

**Explicit type definitions eklendi:**
```prisma
title       String   @db.VarChar(191)
shortDesc   String   @db.VarChar(500)
description String   @db.Text
```

**Güncellenen modeller:**
- Project (9 alan)
- Service (3 alan)
- WorkExperience (3 alan)
- SiteSettings (15+ alan)

### 4. **SQL Migration Scripti**
`scripts/extend-varchar-limits.sql`

**Çalıştırılacak ALTER TABLE komutları:**
- `shortDesc` → VARCHAR(500)
- `description` → TEXT
- `heroBio` → TEXT
- ve diğerleri...

⚠️ **Önemli:** Bu script'i DirectAdmin MySQL'de manuel çalıştır!

### 5. **Settings Admin Sayfası Güncellendi**
`src/app/admin/settings/page.tsx`

**Hero Section için:**
- Ana Başlık: 191 karakter
- Alt Başlık: 500 karakter
- Açıklama: 5000 karakter
- CTA Butonu: 100 karakter

**About Section için:**
- Başlık: 191 karakter
- Açıklama: 500 karakter
- Biyografi 1/2/3: 5000'er karakter

## 🔧 Kullanım Örneği

```tsx
import { TextInputWithCounter, TextAreaWithCounter } from '@/components/ui/CharacterCounter'
import { CHAR_LIMITS } from '@/lib/constants'

// Input örneği
<TextInputWithCounter
  name="title"
  value={formData.title}
  onChange={handleChange}
  maxLength={CHAR_LIMITS.TITLE}
  label="Başlık"
  required
  helperText="Proje başlığını girin"
/>

// Textarea örneği
<TextAreaWithCounter
  name="description"
  value={formData.description}
  onChange={handleChange}
  maxLength={CHAR_LIMITS.DESCRIPTION}
  label="Açıklama"
  rows={5}
/>
```

## 📋 TODO: Diğer Sayfalara Uygulanacak

1. ✅ `/admin/settings` - Hero & About sections (TAMAMLANDI)
2. ⏳ `/admin/projects/new` & `/admin/projects/[id]`
3. ⏳ `/admin/services/new` & `/admin/services/[id]`
4. ⏳ `/admin/experience/new` & `/admin/experience/[id]`
5. ⏳ `/admin/skills/new` & `/admin/skills/[id]`

## 🚀 Deployment Adımları

1. **Database migration çalıştır:**
   ```bash
   # DirectAdmin MySQL interface'de
   mysql -u username -p database_name < scripts/extend-varchar-limits.sql
   ```

2. **Prisma client regenerate:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy  # Production için
   ```

3. **Deploy:**
   ```bash
   npm run build
   # veya Vercel otomatik deploy
   ```

## 💡 Design Decisions

**Neden VARCHAR(191)?**
- MySQL utf8mb4 için max index size
- Unique ve indexed field'lar için standart

**Neden TEXT için soft limit?**
- Database'de sınırsız ama UX için 5000-10000
- Kullanıcı çok uzun text girmek isterse uyarılır

**Renk kodlama mantığı:**
- 0-80%: Gri (normal)
- 80-100%: Sarı (dikkat)
- >100%: Kırmızı (hata + "X karakter fazla")

---

**Son Güncelleme:** 1 Aralık 2025
