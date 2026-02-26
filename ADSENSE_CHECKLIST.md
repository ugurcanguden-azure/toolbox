# ✅ AdSense Setup Checklist - Toolbox

## 📋 Hemen Yapılacaklar (15 dakika)

### 1. Site Yayına Al

```bash
# Production'a deploy et
git add .
git commit -m "feat: add ads.txt and AdSense setup guide"
git push origin main
```

- ⏳ Azure Pipeline'ı bekle
- ✅ Site açılıyor mu test et: https://toolbox.curioboxapp.info/
- ✅ ads.txt kontrol et: https://toolbox.curioboxapp.info//ads.txt

### 2. Google AdSense'e Başvur

- 🌐 **Git:** https://www.google.com/adsense
- 📝 **Site URL:** `https://toolbox.curioboxapp.info/`
- 📧 **Email:** `ugurcanguden@gmail.com`
- ✅ **Submit application**

---

## ⏳ Onay Beklerken (1-2 hafta)

### 3. Google Search Console Ekle

```
1. Git: https://search.google.com/search-console
2. Add property: https://toolbox.curioboxapp.info/
3. Verify ownership (DNS veya HTML file)
4. Submit sitemap: https://toolbox.curioboxapp.info//sitemap.xml
```

### 4. Trafik Artırma

- [ ] Reddit'te paylaş: r/webdev, r/programming, r/SideProject
- [ ] Twitter'da duyur: #dev #tools #opensource
- [ ] Product Hunt'a ekle
- [ ] Alternative.to'ya ekle
- [ ] GitHub README'de feature yap

### 5. İçerik İyileştirme

- [ ] Her tool için SEO meta açıklamaları ekle
- [ ] Blog yazıları yaz (tool'ların kullanımı)
- [ ] YouTube video çek (demo)

---

## 🎉 Onay Gelince (Aynı gün)

### 6. Ad Slot'ları Oluştur

AdSense Dashboard → Ads → By ad unit → New ad unit

**Oluşturulacak 5 Ad Unit:**

1. **"Toolbox - Homepage Top"** → Responsive → ID: `________`
2. **"Toolbox - Homepage Mid"** → Horizontal → ID: `________`
3. **"Toolbox - Homepage Bottom"** → Responsive → ID: `________`
4. **"Toolbox - Tool In-Article 1"** → In-article → ID: `________`
5. **"Toolbox - Tool In-Article 2"** → In-article → ID: `________`

### 7. Placeholder ID'leri Değiştir

#### A) Ana Sayfa (`app/[locale]/page.tsx`)

```typescript
// Satır 433 - Top Banner
dataAdSlot="1234567890"  →  dataAdSlot="________"

// Satır 485 - Mid Banner
dataAdSlot="0987654321"  →  dataAdSlot="________"

// Satır 534 - Bottom Banner
dataAdSlot="5555555555"  →  dataAdSlot="________"
```

#### B) JSON Formatter (`app/[locale]/tools/json-formatter/page.tsx`)

```typescript
// Satır 292 - Before tool
dataAdSlot="6666666666"  →  dataAdSlot="________"

// Satır 397 - After tool
dataAdSlot="7777777777"  →  dataAdSlot="________"
```

#### C) Base64 Tool (`app/[locale]/tools/base64/page.tsx`)

```typescript
// Satır 415 - After info
dataAdSlot="6666666666"  →  dataAdSlot="________"
```

### 8. Deploy Et

```bash
git add .
git commit -m "feat: configure AdSense with real Ad Slot IDs"
git push origin main
```

### 9. Test Et

- [ ] Tarayıcıda aç: https://toolbox.curioboxapp.info/
- [ ] Cookie banner'dan "Kabul Et"
- [ ] Reklamlar görünüyor mu? (AdBlock kapalı)
- [ ] Console'da hata var mı? (F12)
- [ ] Mobilde test et

---

## 📊 İlk Hafta

### 10. Metrikleri İzle

AdSense Dashboard → Reports

**Kontrol edilecekler:**

- **Impressions (Gösterim):** Reklam kaç kez gösterildi?
- **Clicks (Tıklama):** Kaç kişi tıkladı?
- **CTR:** Tıklama oranı (hedef: %0.5+)
- **CPC:** Tık başına kazanç (hedef: $0.50+)
- **Page RPM:** 1000 görüntüleme başına kazanç (hedef: $5+)

### 11. Ad Placement Optimizasyonu

En çok kazandıran konumları bul:

- AdSense → Reports → Ad units
- En yüksek RPM'li ad unit'i belirle
- Düşük performanslı ad'leri kaldır veya değiştir

---

## 💰 Gelir Hedefleri

### İlk Ay:

- **Hedef:** $50-100
- **Strateji:** Trafik artırma odaklı
- **Metrik:** Daily visitors 500+

### 3. Ay:

- **Hedef:** $500-1000
- **Strateji:** SEO + Content marketing
- **Metrik:** Daily visitors 2000+

### 6. Ay:

- **Hedef:** $2000-5000
- **Strateji:** Community building + New tools
- **Metrik:** Daily visitors 5000+

### 1 Yıl:

- **Hedef:** $10,000+/ay
- **Strateji:** Premium features + API monetization
- **Metrik:** Daily visitors 20,000+

---

## 🚨 Önemli Uyarılar

### ❌ ASLA YAPMA:

- [ ] Kendi reklamlarına tıklama
- [ ] Arkadaşlarını tıklamaya zorlama
- [ ] Bot trafik satın alma
- [ ] "Click here" yazarak reklamlara yönlendirme

### ✅ HER ZAMAN YAP:

- [x] Orijinal içerik üret
- [x] Privacy Policy'yi güncelle
- [x] Cookie consent'i göster
- [x] AdSense politikalarına uy
- [x] Metrikleri düzenli takip et

---

## 📞 Yardım & Kaynaklar

- **Detaylı Guide:** [`ADSENSE_SETUP.md`](./ADSENSE_SETUP.md)
- **AdSense Help:** https://support.google.com/adsense
- **AdSense Policies:** https://support.google.com/adsense/answer/48182
- **Community:** https://support.google.com/adsense/community

---

**Son Güncelleme:** 2025-10-08  
**Durum:** ✅ ads.txt hazır, ⏳ AdSense başvurusu bekliyor

**Başarılar! 🚀💰**
