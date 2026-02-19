# Pilates Takip

Bu proje artık **Supabase bağımlı değildir**. Veri katmanı için kendi PostgreSQL veritabanınızı kullanabilirsiniz.

## Mimari

- `frontend` (React + Vite)
- `backend-dotnet` (.NET 8 Web API + Entity Framework + PostgreSQL)

Frontend, backend API'sine `VITE_API_URL` ile bağlanır.

## Local çalışma

### 1) Frontend

```bash
npm install
npm run dev
```

Varsayılan API adresi: `/api`.

Farklı bir backend URL'i için `.env` dosyanıza:

```env
VITE_API_URL=http://localhost:5000/api
```

### 2) Backend (.NET)

```bash
cd backend-dotnet
dotnet restore
dotnet run
```

Bağlantı string'i environment variable ile verilir:

```bash
ConnectionStrings__DefaultConnection="Host=YOUR_VM_IP;Port=5432;Database=pilates_db;Username=postgres;Password=your_password"
```

## Dokploy deploy

### Backend servisi

- Root Directory: `backend-dotnet`
- Build Type: Dockerfile (`backend-dotnet/Dockerfile`)
- Environment Variable:
  - `ConnectionStrings__DefaultConnection=Host=...;Port=5432;Database=...;Username=...;Password=...`

### Frontend servisi

- Root Directory: proje kökü
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable:
  - `VITE_API_URL=https://<backend-domain>/api`

> Not: Backend'de CORS şu an `AllowAnyOrigin` olarak açık. Prod ortamında domain bazlı kısıtlamanız önerilir.
