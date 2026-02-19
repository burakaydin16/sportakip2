 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/README.md b/README.md
index cd44d4727da2c51a93e722b7d527226d3c188032..c09f23aa89115088973f202f98ee1604abdecb3d 100644
--- a/README.md
+++ b/README.md
@@ -1,20 +1,60 @@
-<div align="center">
-<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
-</div>
+# Pilates Takip
 
-# Run and deploy your AI Studio app
+Bu proje artık **Supabase bağımlı değildir**. Veri katmanı için kendi PostgreSQL veritabanınızı kullanabilirsiniz.
 
-This contains everything you need to run your app locally.
+## Mimari
 
-View your app in AI Studio: https://ai.studio/apps/76b262e0-fa74-4aec-9894-59d0827ec742
+- `frontend` (React + Vite)
+- `backend-dotnet` (.NET 8 Web API + Entity Framework + PostgreSQL)
 
-## Run Locally
+Frontend, backend API'sine `VITE_API_URL` ile bağlanır.
 
-**Prerequisites:**  Node.js
+## Local çalışma
 
+### 1) Frontend
 
-1. Install dependencies:
-   `npm install`
-2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
-3. Run the app:
-   `npm run dev`
+```bash
+npm install
+npm run dev
+```
+
+Varsayılan API adresi: `/api`.
+
+Farklı bir backend URL'i için `.env` dosyanıza:
+
+```env
+VITE_API_URL=http://localhost:5000/api
+```
+
+### 2) Backend (.NET)
+
+```bash
+cd backend-dotnet
+dotnet restore
+dotnet run
+```
+
+Bağlantı string'i environment variable ile verilir:
+
+```bash
+ConnectionStrings__DefaultConnection="Host=YOUR_VM_IP;Port=5432;Database=pilates_db;Username=postgres;Password=your_password"
+```
+
+## Dokploy deploy
+
+### Backend servisi
+
+- Root Directory: `backend-dotnet`
+- Build Type: Dockerfile (`backend-dotnet/Dockerfile`)
+- Environment Variable:
+  - `ConnectionStrings__DefaultConnection=Host=...;Port=5432;Database=...;Username=...;Password=...`
+
+### Frontend servisi
+
+- Root Directory: proje kökü
+- Build Command: `npm run build`
+- Output Directory: `dist`
+- Environment Variable:
+  - `VITE_API_URL=https://<backend-domain>/api`
+
+> Not: Backend'de CORS şu an `AllowAnyOrigin` olarak açık. Prod ortamında domain bazlı kısıtlamanız önerilir.
 
EOF
)