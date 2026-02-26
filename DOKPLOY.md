# Dokploy ile Deploy

## Kurulum

1. **Dokploy** panelinde yeni **Docker Compose** uygulaması oluştur
2. Repo'yu bağla, compose dosyası: `docker-compose.yml`
3. **Environment Variables** ekle:
   - `DATABASE_URL` = PostgreSQL bağlantı URL'niz
   - `DATABASE_SSL` = `false` (SSL desteklemeyen sunucular için zorunlu)
4. **Domains** sekmesinde **Add Domain**:
   - **Host:** Domain adresiniz (örn. `sportakip.example.com`)
   - **Service:** `frontend` seçin (önemli!)
   - **Container Port:** `80` (önemli: 3000 veya 8080 değil!)
5. **Deploy** → Domain ekledikten sonra **yeniden deploy** yapın (Docker Compose için zorunlu)

## 502 Bad Gateway Çözümleri

### 1. Domain ayarlarını kontrol edin
- **Service** mutlaka `frontend` olmalı (`api` değil)
- **Container Port** mutlaka `80` olmalı

### 2. Domain ekledikten sonra yeniden deploy
Docker Compose'da domain değişikliği için **mutlaka tekrar Deploy** yapın.

### 3. Logları kontrol edin
- **frontend** logu: nginx başladı mı? hata var mı?
- **api** logu: "API http://0.0.0.0:5000 üzerinde çalışıyor" mesajı var mı?
  - Veritabanı hatası varsa: `DATABASE_SSL=false` ve `DATABASE_URL` doğru mu?

### 4. Domain eklemeden test (IP ile erişim)
- `http://SUNUCU_IP:8080` adresinden erişmeyi deneyin
- Bu çalışıyorsa sorun domain/Traefik tarafındadır

### 5. Dokploy Isolated Deployments
Isolated Deployments kapalıysa **Advanced** → **Utilities** altından açmayı deneyin.

## Port Özeti

| Erişim | Ayarlar |
|--------|---------|
| Domain ile | Domains: Service=`frontend`, Port=`80` |
| IP ile | `http://SUNUCU_IP:8080` |

## Veritabanı

PostgreSQL tabloları (`athletes`, `sessions`) ilk çalıştırmada otomatik oluşturulur.
