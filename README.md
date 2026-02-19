# Pilates Takip Sistemi

Bu proje, sporcu ve ders programı takibi yapabilen modern bir web uygulamasıdır. Artık **Supabase bağımlılığı kaldırılmış**, yerini yerel bir .NET 8 API ve PostgreSQL veritabanı almıştır.

## Mimari Yapı

- **Frontend:** React + Vite + TypeScript (Lucide icons, Recharts)
- **Backend:** .NET 8 Web API + Entity Framework Core + PostgreSQL

## Hızlı Kurulum (Docker Compose)

En kolay kurulum yöntemi Docker Compose kullanmaktır. Proje ana dizininde:

```bash
docker-compose up -d --build
```

Bu komut veritabanını, API'yi ve Frontend'i otomatik olarak ayağa kaldırır.

## Dokploy ile Yayına Alma

Dokploy üzerinde her iki servisi (Frontend ve Backend) tek bir **Compose** servisi olarak veya ayrı ayrı servisler olarak yükleyebilirsiniz.

### Yöntem 1: Compose Servisi (Önerilen)
Dokploy'da yeni bir **Compose** servisi oluşturun ve depoyu (GitHub/GitLab) bağlayın. Ana dizindeki `docker-compose.yml` dosyasını kullanacaktır.

### Yöntem 2: Ayrı Servisler
1. **Backend:**
   - Root Directory: `backend-dotnet`
   - Build Type: `Dockerfile`
   - Env Variable: `ConnectionStrings__DefaultConnection`

2. **Frontend:**
   - Root Directory: `.` (Ana dizin)
   - Build Type: `Dockerfile.frontend` (Hazırladığım Nginx destekli Dockerfile)

## Yerel Geliştirme

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend-dotnet
dotnet run
```
Bağlantı dizesini `appsettings.json` içinden veya environment variable (`ConnectionStrings__DefaultConnection`) olarak ayarlayabilirsiniz.