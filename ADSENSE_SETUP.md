# 💰 Google AdSense Setup Guide - Toolbox

> ✨ **Using:** `next-google-adsense` library for clean integration

## 📋 İçindekiler

1. [AdSense Hesap Onayı](#1-adsense-hesap-onayı)
2. [Ads.txt Doğrulama](#2-adstxt-doğrulama)
3. [Ad Slot Oluşturma](#3-ad-slot-oluşturma)
4. [Placeholder ID'leri Değiştirme](#4-placeholder-idleri-değiştirme)
5. [Production'a Deployment](#5-productiona-deployment)
6. [Gelir Takibi](#6-gelir-takibi)
7. [Optimizasyon İpuçları](#7-optimizasyon-ipuçları)

---

## 1. AdSense Hesap Onayı

### A) Başvuru

1. **Google AdSense'e git:** https://www.google.com/adsense
2. **Sign up** veya **Get started** butonuna tıkla
3. **Website URL:** `https://toolbox.curioboxapp.info/`
4. **Email:** `ugurcanguden@gmail.com`
5. **Submit your application**

### B) Site Doğrulama

✅ **Zaten tamamlandı!** `app/layout.tsx` dosyasında entegrasyon yapıldı:

```tsx
// Meta tag (head'de)
<meta name="google-adsense-account" content="ca-pub-9339461513261360" />

// Script (body'de - via next-google-adsense)
<GoogleAdSense publisherId="ca-pub-9339461513261360" />
```

### C) Onay Süreci

- ⏳ **Süre:** 1-2 hafta (bazen birkaç gün)
- 📧 **E-posta:** AdSense'ten onay e-postası gelecek
- ✅ **Kriterler:**
  - Yeterli içerik (✅ 30 tool var!)
  - Orijinal içerik (✅ tümü orijinal)
  - Kullanıcı dostu tasarım (✅ modern UI)
  - Privacy Policy (✅ var)
  - Cookie Consent (✅ var)

---

## 2. Ads.txt Doğrulama

✅ **Zaten oluşturuldu!** `public/ads.txt` dosyası mevcut.

**Doğrulama:**

1. Site yayına aldıktan sonra: `https://toolbox.curioboxapp.info//ads.txt`
2. Şu içeriği görmeli:
   ```
   google.com, pub-9339461513261360, DIRECT, f08c47fec0942fa0
   ```

**AdSense Dashboard'da Kontrol:**

- AdSense → Account → Sites → free-dev-tools.net.tr
- "Ads.txt file" durumu: ✅ Authorized

---

## 3. Ad Slot Oluşturma

### AdSense Dashboard'da:

1. **Sol menüden:** Ads → **Overview** → **By ad unit**
2. **"Display ads"** seç (en popüler)
3. **Ad unit name** gir (ör: "Toolbox - Homepage Top Banner")
4. **Ad size:** **Responsive** seç (mobil + desktop uyumlu)
5. **Create** butonuna tıkla
6. **Ad code** sayfasında:
   - `data-ad-slot="1234567890"` → Bu kısmı kopyala!

### Oluşturulması Gereken Ad Slot'lar:

| #   | Ad Unit Name                     | Recommended Size    | Usage          |
| --- | -------------------------------- | ------------------- | -------------- |
| 1   | Toolbox - Homepage Top Banner    | Responsive          | Ana sayfa üst  |
| 2   | Toolbox - Homepage Mid Banner    | Horizontal (728x90) | Ana sayfa orta |
| 3   | Toolbox - Homepage Bottom Banner | Responsive          | Ana sayfa alt  |
| 4   | Toolbox - Tool In-Article 1      | In-article          | Tool sayfaları |
| 5   | Toolbox - Tool In-Article 2      | In-article          | Tool sayfaları |

**Her biri için Ad Slot ID'yi kaydet!** (ör: `1234567890`)

---

## 4. Placeholder ID'leri Değiştirme

### Değiştirilmesi Gereken Dosyalar:

#### A) Ana Sayfa (`app/[locale]/page.tsx`)

```typescript
// Satır 433 civarı - Top Banner
<AdBanner dataAdSlot="1234567890" className="..." />
// ↓ Değiştir:
<AdBanner dataAdSlot="GERÇEK_AD_SLOT_ID_1" className="..." />

// Satır 485 civarı - Mid Banner
<AdBanner dataAdSlot="0987654321" dataAdFormat="horizontal" className="..." />
// ↓ Değiştir:
<AdBanner dataAdSlot="GERÇEK_AD_SLOT_ID_2" dataAdFormat="horizontal" className="..." />

// Satır 534 civarı - Bottom Banner
<AdBanner dataAdSlot="5555555555" className="..." />
// ↓ Değiştir:
<AdBanner dataAdSlot="GERÇEK_AD_SLOT_ID_3" className="..." />
```

#### B) JSON Formatter (`app/[locale]/tools/json-formatter/page.tsx`)

```typescript
// Satır 292 civarı - Before tool
<InArticleAd dataAdSlot="6666666666" />
// ↓ Değiştir:
<InArticleAd dataAdSlot="GERÇEK_AD_SLOT_ID_4" />

// Satır 397 civarı - After tool
<InArticleAd dataAdSlot="7777777777" />
// ↓ Değiştir:
<InArticleAd dataAdSlot="GERÇEK_AD_SLOT_ID_5" />
```

#### C) Base64 Tool (`app/[locale]/tools/base64/page.tsx`)

```typescript
// Satır 415 civarı - After info
<InArticleAd dataAdSlot="6666666666" />
// ↓ Değiştir:
<InArticleAd dataAdSlot="GERÇEK_AD_SLOT_ID_4" />
```

### Toplu Değiştirme (VS Code):

1. **Find:** `dataAdSlot="1234567890"`
2. **Replace:** `dataAdSlot="GERÇEK_SLOT_ID"`
3. **Replace All** (veya tek tek kontrol et)

---

## 5. Production'a Deployment

### A) Değişiklikleri Commit Et:

```bash
git add .
git commit -m "feat: configure Google AdSense with real Ad Slot IDs"
git push origin main
```

### B) Azure Pipeline Çalıştır:

- Pipeline otomatik tetiklenecek
- Docker image build edilecek
- Sunucuya deploy edilecek

### C) Doğrula:

```bash
# 1. Site açılıyor mu?
curl https://toolbox.curioboxapp.info/

# 2. ads.txt görünüyor mu?
curl https://toolbox.curioboxapp.info//ads.txt

# 3. AdSense script yükleniyor mu?
# Tarayıcıda F12 → Network → adsbygoogle.js
```

---

## 6. Gelir Takibi

### AdSense Dashboard:

1. **Home → Overview:**
   - Bugünkü kazanç
   - Bu ay kazanç
   - Tıklama oranı (CTR)
   - Bin gösterim başına kazanç (RPM)

2. **Reports:**
   - Detaylı raporlar
   - Tarih aralığı seç
   - Ad unit bazında karşılaştırma

### Önemli Metrikler:

- **Page RPM (Revenue Per Mille):** 1000 sayfa görüntüleme başına kazanç
  - **İyi:** $3-10
  - **Çok İyi:** $10-25
  - **Mükemmel:** $25+

- **CTR (Click Through Rate):** Tıklama oranı
  - **İyi:** %0.5-1%
  - **Çok İyi:** %1-2%
  - **Mükemmel:** %2+

- **CPC (Cost Per Click):** Tık başına kazanç
  - **İyi:** $0.10-0.50
  - **Çok İyi:** $0.50-2
  - **Mükemmel:** $2+

---

## 7. Optimizasyon İpuçları

### A) Ad Placement (Reklam Yerleşimi)

✅ **Şu anda yapılanlar:**

- ✅ Above the fold (sayfa üstünde)
- ✅ Between content (içerik arası)
- ✅ After content (içerik sonrası)
- ❌ Sidebar (yok - eklenebilir)

**Öneriler:**

- **En çok kazandıran:** Above the fold + In-article
- **En az rahatsız edici:** After content
- **Dengeli yaklaşım:** Şu anki yapı iyi! 👍

### B) Ad Formats (Reklam Formatları)

✅ **Kullandığımız:**

- Display ads (responsive)
- In-article ads

**Eklenebilir:**

- **Multiplex ads** (related content grid)
- **Sticky ads** (footer'da sabit reklam)
- **Anchor ads** (mobilde alt/üstte sabit)

### C) SEO & Traffic

Daha çok trafik = Daha çok kazanç!

**Yapılacaklar:**

1. **Google Search Console'a ekle**
   - https://search.google.com/search-console
   - Sitemap ekle: `https://toolbox.curioboxapp.info//sitemap.xml`

2. **Sosyal Medya:**
   - Reddit: r/webdev, r/programming
   - Twitter: Developer hashtag'leri
   - Product Hunt: Launch yap!

3. **Backlinks:**
   - GitHub README'de paylaş
   - Dev.to'da makale yaz
   - Alternative.to'ya ekle

### D) Content Strategy

**Developer tools** = **Yüksek CPC** (tık başına kazanç)!

- Developer'lar = Yüksek gelirli kitle
- Tech ads = Yüksek ücretli reklamlar
- B2B software ads = En yüksek CPC

**Ek tool önerileri:**

- API Testing tools
- Database tools
- Docker/Kubernetes tools
- Cloud tools
  → Daha fazla tool = Daha fazla trafik = Daha fazla kazanç

---

## 8. Troubleshooting

### Reklamlar görünmüyor?

1. **AdSense onayı aldın mı?** (1-2 hafta sürebilir)
2. **Ad Slot ID'leri doğru mu?** (placeholder'ları değiştirdin mi?)
3. **Cookie consent verdin mi?** (Banner'dan "Kabul Et")
4. **AdBlock kullanıyor musun?** (Kapat ve tekrar dene)
5. **Console'da hata var mı?** (F12 → Console)

### "Ads.txt file not found" hatası?

1. `public/ads.txt` dosyası var mı?
2. Production'a deploy edildi mi?
3. `https://toolbox.curioboxapp.info//ads.txt` açılıyor mu?
4. 24 saat bekle (cache temizlensin)

### Kazanç çok düşük?

1. **Trafik artır:** SEO, sosyal medya, backlinks
2. **CTR artır:** Ad placement optimize et
3. **Page views artır:** Daha fazla tool ekle
4. **Sabırlı ol:** İlk ay genelde düşük olur

---

## 9. AdSense Policy Compliance

### ✅ Uyumluluk Kontrol Listesi:

- ✅ Orijinal içerik
- ✅ Privacy Policy
- ✅ Cookie Consent (GDPR)
- ✅ Hiç telif hakkı ihlali yok
- ✅ Spam yok
- ✅ Yetişkin içerik yok
- ✅ Uyuşturucu/alkol içeriği yok
- ✅ Şiddet içeriği yok
- ✅ Fake news yok

### ⚠️ Yasak Davranışlar:

- ❌ Kendi reklamlarına tıklama
- ❌ Kullanıcıları tıklamaya teşvik etme
- ❌ "Reklamlara tıklayın" yazmak
- ❌ Reklamların yanına ok işareti koymak
- ❌ Bot trafik satın almak

**Uyarı:** Bu kurallara uymazsan hesabın kalıcı olarak kapatılabilir! 🚨

---

## 10. Expected Revenue (Tahmini Gelir)

### Örnek Senaryolar:

#### **Senaryo 1: Küçük Başlangıç**

- **Günlük ziyaretçi:** 100
- **Sayfa başına görüntüleme:** 3
- **Page RPM:** $5
- **Aylık kazanç:** 100 × 3 × $5 × 30 ÷ 1000 = **$45/ay**

#### **Senaryo 2: Orta Büyüklük**

- **Günlük ziyaretçi:** 1,000
- **Sayfa başına görüntüleme:** 4
- **Page RPM:** $8
- **Aylık kazanç:** 1,000 × 4 × $8 × 30 ÷ 1000 = **$960/ay**

#### **Senaryo 3: Başarılı Proje**

- **Günlük ziyaretçi:** 5,000
- **Sayfa başına görüntüleme:** 5
- **Page RPM:** $12
- **Aylık kazanç:** 5,000 × 5 × $12 × 30 ÷ 1000 = **$9,000/ay**

**Not:** Developer tools için RPM genelde $10-20 arası! 🚀

---

## 11. Next Steps

### Hemen Yapılacaklar:

1. ✅ ads.txt oluşturuldu
2. ⏳ AdSense onayını bekle (1-2 hafta)
3. ⏳ Ad Slot ID'leri oluştur (onay sonrası)
4. ⏳ Placeholder ID'leri değiştir
5. ⏳ Production'a deploy et

### İlk Ayda:

- Google Search Console'a ekle
- Sosyal medyada paylaş
- İlk metrikleri izle
- Ad placement'ı optimize et

### 3 Ay İçinde:

- 10 yeni tool ekle
- Blog yazıları yaz
- Backlink'ler topla
- Community oluştur

---

## 📞 Destek

- **AdSense Help Center:** https://support.google.com/adsense
- **Community Forum:** https://support.google.com/adsense/community
- **Email:** Hesap onaylandıktan sonra AdSense'ten destek alabilirsin

---

**Başarılar! İlk gelirlerin hayırlı olsun! 💰🎉**
