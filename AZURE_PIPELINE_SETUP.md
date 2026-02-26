# 🔵 Azure DevOps Pipeline Kurulum Rehberi

Bu rehber, Toolbox uygulamasını Azure DevOps ile otomatik deploy etmek için gerekli adımları içerir.

## 📋 Ön Gereksinimler

- Azure DevOps hesabı ve projesi
- Node.js 18+ (veya 22+ önerilen)
- Docker Registry erişimi (`registry.qqrchef.com`)
- Deployment server'a SSH erişimi
- Azure DevOps Agent (self-hosted veya Microsoft-hosted)

---

## 🎯 1. Azure DevOps Pipeline Oluşturma

### A. Yeni Pipeline Oluştur

1. Azure DevOps'ta projenize gidin
2. **Pipelines** → **New Pipeline**
3. **Azure Repos Git** seçin
4. Repository'nizi seçin: `toolbox`
5. **Existing Azure Pipelines YAML file** seçin
6. Branch: `main`
7. Path: `/azure-pipelines.yml`
8. **Continue** tıklayın

---

## 🔐 2. Environment Variables Tanımlama

Azure DevOps'ta **Pipelines** → **Library** → **Variable Groups**

### Yeni Variable Group Oluştur: `toolbox-prod`

| Variable Name          | Value                               | Secret? | Açıklama                                                  |
| ---------------------- | ----------------------------------- | ------- | --------------------------------------------------------- |
| `ENVIRONMENT`          | `prod`                              | ❌      | Environment adı (prod/staging/uat)                        |
| `SSH_USER`             | `root`                              | ❌      | Deployment server SSH kullanıcısı                         |
| `SSH_HOST`             | `164.92.135.142`                    | ❌      | Deployment server IP adresi                               |
| `SSH_PASSWORD`         | `.48Qqrchef`                        | ✅      | SSH şifresi (gizli)                                       |
| `CONTAINER_PORT`       | `3000`                              | ❌      | Docker container içi port                                 |
| `SERVER_PORT`          | `80`                                | ❌      | Server'da expose edilen port (80 for HTTP, 443 for HTTPS) |
| `NEXT_PUBLIC_SITE_URL` | `https://toolbox.curioboxapp.info/` | ❌      | Uygulamanın public URL'i                                  |

### Variable Group'u Pipeline'a Ekle

`azure-pipelines.yml` dosyasının başına ekle:

```yaml
variables:
  - group: toolbox-prod # Variable group referansı
```

---

## 🌍 3. Multiple Environments (Opsiyonel)

Farklı environment'lar için (prod, staging, uat) ayrı variable group'lar oluştur:

### `toolbox-staging`

- `ENVIRONMENT`: `staging`
- `SSH_HOST`: `<staging-server-ip>`
- `SERVER_PORT`: `80`
- `NEXT_PUBLIC_SITE_URL`: `https://staging.free-dev-tools.net.tr`

### `toolbox-uat`

- `ENVIRONMENT`: `uat`
- `SSH_HOST`: `<uat-server-ip>`
- `SERVER_PORT`: `80`
- `NEXT_PUBLIC_SITE_URL`: `https://uat.free-dev-tools.net.tr`

---

## 🔧 4. Pipeline Ayarları

### A. Branch Trigger Ayarla

Hangi branch'lerde pipeline'ın tetikleneceğini ayarla:

```yaml
trigger:
  branches:
    include:
      - main # Production
      - develop # Staging
      - uat # UAT
```

### B. Environment Approval (Opsiyonel)

Production deploy öncesi manuel onay için:

1. Azure DevOps → **Pipelines** → **Environments**
2. **New Environment** → `production`
3. **Approvals and checks** → **Approvals**
4. Onaylayıcıları ekle

Pipeline'a ekle:

```yaml
- deployment: DeployToProduction
  environment: production # Manuel onay gerektirir
```

---

## 🐳 5. Docker Registry Ayarları

### A. Registry Erişimi Test Et

```bash
# Local'de test et
docker login registry.qqrchef.com -u QqrchefRepositoryUser

# Image push test
docker tag test-image registry.qqrchef.com/test-image:latest
docker push registry.qqrchef.com/test-image:latest
```

### B. Server'da Docker Login

SSH ile server'a bağlan ve registry'ye login ol:

```bash
ssh root@164.92.135.142
docker login registry.qqrchef.com -u QqrchefRepositoryUser
```

---

## 🚀 6. İlk Deployment

### A. Pipeline'ı Çalıştır

1. Azure DevOps → **Pipelines**
2. `toolbox` pipeline'ını seç
3. **Run Pipeline** tıkla
4. Branch: `main`
5. **Run**

### B. Deployment İzle

Pipeline çalışırken her adımı takip et:

- ✅ Build Next.js App
- ✅ Login to Docker Registry
- ✅ Build Docker Image
- ✅ Tag & Push Docker Image
- ✅ Deploy to Production Server
- ✅ Health Check

### C. Logs Kontrol Et

Her step'in loglarını kontrol et:

- Build hataları
- Docker build output
- SSH connection logs
- Container startup logs

---

## 🏥 7. Deployment Sonrası Kontrol

### A. Application Erişimi

Browser'da aç:

```
https://toolbox.curioboxapp.info/
```

veya IP ile:

```
http://164.92.135.142
```

### B. Container Durumu

SSH ile server'a bağlan:

```bash
ssh root@164.92.135.142

# Container'ı kontrol et
docker ps | grep toolbox-prod

# Container loglarını gör
docker logs toolbox-prod

# Container stats
docker stats toolbox-prod
```

### C. Health Check

```bash
# HTTP status kontrol (domain)
curl -I https://toolbox.curioboxapp.info/

# veya IP ile
curl -I http://164.92.135.142

# Detailed response
curl https://toolbox.curioboxapp.info/
```

---

## 🔄 8. Güncellemeler ve Yeniden Deploy

### Otomatik Deployment

Kod değişikliği sonrası:

```bash
git add .
git commit -m "feat: new feature"
git push origin main
```

Pipeline otomatik tetiklenir ve deploy eder!

### Manuel Deployment

Azure DevOps'ta:

1. **Pipelines** → `toolbox`
2. **Run Pipeline**
3. Branch seç
4. **Run**

---

## 🚨 9. Troubleshooting

### Problem: SSH Connection Failed

```bash
# SSH bağlantısını test et
ssh -o StrictHostKeyChecking=no root@164.92.135.142

# Port kontrol
telnet 164.92.135.142 22
```

### Problem: Docker Registry Login Failed

```bash
# Registry erişimini test et
curl https://registry.qqrchef.com/v2/

# Credentials kontrol et
docker login registry.qqrchef.com -u QqrchefRepositoryUser
```

### Problem: Container Başlamıyor

```bash
# Container loglarını gör
docker logs toolbox-prod

# Container inspect
docker inspect toolbox-prod

# Port çakışması kontrolü
sudo lsof -i :3000
```

### Problem: Build Failed

Azure DevOps logs:

1. Failed step'e tıkla
2. Error mesajını oku
3. Gerekli düzeltmeleri yap
4. Yeniden çalıştır

---

## 📊 10. Monitoring & Logs

### A. Pipeline Metrics

Azure DevOps → **Pipelines** → **Analytics**

- Build success rate
- Average build time
- Deployment frequency

### B. Application Logs

```bash
# Real-time logs
docker logs -f toolbox-prod

# Son 100 satır
docker logs --tail 100 toolbox-prod

# Timestamp ile
docker logs -t toolbox-prod
```

### C. Server Resources

```bash
# CPU & Memory
docker stats toolbox-prod

# Disk usage
df -h

# Docker disk usage
docker system df
```

---

## 🎯 11. Best Practices

### ✅ Yapılması Gerekenler:

- Variable'ları Azure DevOps Library'de sakla
- Sensitive data'yı "Secret" olarak işaretle
- Her deployment'tan sonra health check yap
- Staging environment'ta test et
- Deployment öncesi backup al
- Pipeline başarısız olursa notification al

### ❌ Yapılmaması Gerekenler:

- Şifreleri YAML dosyasına yazma
- Production'a direkt push etme (staging'den geçir)
- Health check skip etme
- Backup almadan deploy etme
- Log'ları incelemeden production'a alma

---

## 📞 Destek

Sorun yaşarsan:

1. Pipeline logs'unu kontrol et
2. Server logs'unu kontrol et (`docker logs`)
3. DEPLOYMENT.md dosyasına bak
4. Azure DevOps documentation'a bak

---

## 🎉 Özet

✅ Azure Pipeline yapılandırıldı  
✅ Variable Groups tanımlandı  
✅ Docker Registry entegrasyonu  
✅ SSH deployment ayarlandı  
✅ Health checks eklendi  
✅ Multi-environment support

**Artık her `git push` ile otomatik deployment! 🚀**

---

**Son Güncelleme:** 2025-10-08  
**Pipeline Versiyonu:** 1.0.0
