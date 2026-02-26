# Dokploy ile Deploy

## Hızlı Kurulum

1. **Dokploy** panelinde yeni **Docker Compose** uygulaması oluştur
2. Repo'yu bağla
3. Compose dosyası olarak `docker-compose.yml` seç
4. **Environment Variables** bölümüne ekle:
   - `DATABASE_URL` = PostgreSQL bağlantı URL'niz (örn: `postgresql://kullanici:sifre@host:5432/sportakip`)
   - `DATABASE_SSL` = `true` (isteğe bağlı, varsayılan: true)
5. **Build & Deploy** ile projeyi derle ve çalıştır

## Port

Frontend `3000` portunda yayınlanır. Dokploy'da domain veya reverse proxy ile istediğiniz adrese yönlendirebilirsiniz.

## Veritabanı

PostgreSQL tabloları (`athletes`, `sessions`) ilk çalıştırmada otomatik oluşturulur.
