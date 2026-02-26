# Dokploy ile Deploy

## Hızlı Kurulum

1. **Dokploy** panelinde yeni **Docker Compose** uygulaması oluştur
2. Repo'yu bağla, compose dosyası olarak `docker-compose.yml` seç
3. **Environment Variables** ekle:
   - `DATABASE_URL` = PostgreSQL bağlantı URL'niz
   - `DATABASE_SSL` = `false` (SSL desteklemeyen sunucular için zorunlu)
4. **Domains** sekmesinde domain ekleyecekseniz:
   - **Service:** `frontend`
   - **Port:** `80` (önemli: 3000 değil!)
5. **Build & Deploy** ile projeyi derle ve çalıştır

## Port

- **Domain ile:** Dokploy Domains'te Service=frontend, Port=**80** seçin
- **IP ile:** `http://SUNUCU_IP:3000` adresinden erişin

## Veritabanı

PostgreSQL tabloları (`athletes`, `sessions`) ilk çalıştırmada otomatik oluşturulur.
