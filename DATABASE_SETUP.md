# DirectAdmin Database Kurulum Rehberi

## 🎯 Adım 1: DirectAdmin'de Database Oluştur

1. **DirectAdmin paneline giriş yap**
2. **"MySQL Management"** veya **"MySQL Databases"** bölümüne git
3. **Yeni Database Oluştur:**
   - Database adı: `portfolio_db` (veya `kullaniciadi_portfolio`)
   - Create Database butonuna tıkla

4. **Yeni Database User Oluştur:**
   - Username: `portfolio_user` (veya `kullaniciadi_portfolio`)
   - Password: Güçlü bir şifre oluştur (kaydet!)
   - Create User butonuna tıkla

5. **User'ı Database'e Ata:**
   - User seç: `portfolio_user`
   - Database seç: `portfolio_db`
   - **ALL PRIVILEGES** seç
   - Add User to Database butonuna tıkla

## 🔑 Adım 2: .env Dosyasını Güncelle

Database bilgilerini `.env` dosyasına ekle:

```env
DATABASE_URL="mysql://KULLANICI_ADI:SIFRE@localhost:3306/DATABASE_ADI"
```

**Örnek:**
```env
DATABASE_URL="mysql://portfolio_user:MyStr0ngP@ss123@localhost:3306/portfolio_db"
```

### ⚠️ Önemli Notlar:
- Eğer DirectAdmin kullanıcı prefixi ekliyorsa: `kullaniciadi_portfolio`
- Port genelde `3306` (varsayılan MySQL portu)
- Host `localhost` (aynı sunucuda çalıştığı için)
- Şifrede özel karakterler varsa URL encoding gerekebilir:
  - `@` → `%40`
  - `:` → `%3A`
  - `/` → `%2F`

## 🚀 Adım 3: Database Migration Çalıştır

Terminalde çalıştır:

```bash
npx prisma migrate dev --name init
```

Bu komut:
- Database'de tüm tabloları oluşturur
- Prisma Client'ı generate eder
- Migration history'sini kaydeder

## ✅ Adım 4: Bağlantıyı Test Et

```bash
npx prisma studio
```

Bu komut tarayıcıda database yönetim arayüzü açar.

## 🆘 Sorun Yaşarsan:

### Bağlantı Hatası:
1. DirectAdmin'de database/user ismini kontrol et
2. Şifrenin doğru olduğunu kontrol et
3. User'ın database'e atandığını kontrol et

### Port Hatası:
- DirectAdmin'den MySQL portunu kontrol et (genelde 3306)

### Permission Hatası:
- User'a ALL PRIVILEGES verildiğinden emin ol

## 📝 Sonraki Adım:
Database kurulduktan sonra admin panel kodlamaya başlayacağız!
