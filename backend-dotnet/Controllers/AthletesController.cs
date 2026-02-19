 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/services/athleteService.ts b/services/athleteService.ts
index 0e788ee9d268cf98fb00149ccce5ad4819110f8a..86c7003d8a4889e483aa0640ba7d6249ef7df71d 100644
--- a/services/athleteService.ts
+++ b/services/athleteService.ts
@@ -1,29 +1,29 @@
 
 import { Athlete } from '../types';
 
-const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
+const API_URL = import.meta.env.VITE_API_URL || '/api';
 
 export const athleteService = {
   async getAll(): Promise<Athlete[]> {
     const response = await fetch(`${API_URL}/athletes`);
     if (!response.ok) throw new Error('Sporcular yüklenemedi');
     return response.json();
   },
 
   async create(name: string, phone?: string): Promise<Athlete> {
     const response = await fetch(`${API_URL}/athletes`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ name, phone, is_active: true })
     });
     if (!response.ok) throw new Error('Sporcu oluşturulamadı');
     return response.json();
   },
 
   async softDelete(id: string): Promise<void> {
     const response = await fetch(`${API_URL}/athletes/${id}/soft-delete`, {
       method: 'POST'
     });
     if (!response.ok) throw new Error('Sporcu silinemedi');
   },
 
 
EOF
)