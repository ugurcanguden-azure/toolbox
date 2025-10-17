# Google Analytics Entegrasyonu

## 📊 Kurulum Detayları

Google Analytics (GA4) başarıyla projeye entegre edilmiştir.

### Measurement ID
- **ID:** `G-ZMJ4DGCZHP`
- **Tip:** Google Analytics 4 (GA4)

### Kurulum Bileşenleri

#### 1. Analytics Component
**Dosya:** `components/analytics/google-analytics.tsx`
- Next.js `Script` component kullanılarak optimize edilmiş yükleme
- `strategy="afterInteractive"` ile performans odaklı yükleme
- Sayfa değişikliklerini otomatik track eden `AnalyticsTracker`
- Suspense boundary ile SSR uyumlu

#### 2. Analytics Utility
**Dosya:** `lib/analytics.ts`
- `pageview()` - Sayfa görüntüleme tracking
- `event()` - Custom event tracking
- Type-safe event logging

#### 3. Root Layout
**Dosya:** `app/layout.tsx`
- `<GoogleAnalytics />` component body'de
- AdSense ile birlikte optimize edilmiş yerleşim

### Özellikler

✅ **Sayfa Tracking:**
- Her sayfa değişiminde otomatik pageview
- URL parametreleri dahil tracking
- Next.js App Router ile tam uyumlu

✅ **Performans:**
- `afterInteractive` strategy ile optimize yükleme
- DNS prefetch ve preconnect optimizasyonları
- Suspense boundary ile hydration hataları önlendi

✅ **Type Safety:**
- TypeScript ile tam tip güvenliği
- Custom event tracking için type-safe API

### Kullanım Örnekleri

#### Custom Event Tracking

```typescript
import { event } from '@/lib/analytics';

// Button click tracking
event({
  action: 'click',
  category: 'Tool',
  label: 'JSON Formatter',
  value: 1
});

// Download tracking
event({
  action: 'download',
  category: 'Export',
  label: 'CSV File',
});
```

### Google Analytics Dashboard

Analytics verilerinizi görüntülemek için:
1. https://analytics.google.com adresine gidin
2. Property: **Toolbox** seçin
3. Measurement ID: **G-ZMJ4DGCZHP**

### Test Etme

Production'da test etmek için:
1. Siteyi ziyaret edin
2. Google Analytics Dashboard > Realtime bölümüne gidin
3. Aktif kullanıcıları görmelisiniz

Development'ta test etmek için:
```bash
npm run build
npm start
```

### Notlar

- ✅ GDPR uyumlu (Privacy Policy sayfası mevcut)
- ✅ Cookie consent sistemi ile entegre
- ✅ Production-ready
- ✅ Next.js 14 App Router optimizasyonları

### İlgili Dosyalar

- `components/analytics/google-analytics.tsx` - Ana component
- `components/analytics/index.tsx` - Export barrel
- `lib/analytics.ts` - Utility functions
- `app/layout.tsx` - Integration point

---

**Kurulum Tarihi:** 16 Ekim 2025
**Versiyon:** 2.1.0

