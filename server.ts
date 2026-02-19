import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database (In-memory for preview)
  let athletes = [
    { id: '1', name: 'Örnek Sporcu', is_active: true, created_at: new Date().toISOString() }
  ];
  let sessions: any[] = [];

  // API Routes
  app.get("/api/athletes", (req, res) => {
    res.json(athletes.filter(a => a.is_active));
  });

  app.post("/api/athletes", (req, res) => {
    const newAthlete = {
      id: Math.random().toString(36).substr(2, 9),
      name: req.body.name,
      phone: req.body.phone,
      is_active: true,
      created_at: new Date().toISOString()
    };
    athletes.push(newAthlete);
    res.json(newAthlete);
  });

  app.post("/api/athletes/:id/soft-delete", (req, res) => {
    const athlete = athletes.find(a => a.id === req.params.id);
    if (athlete) athlete.is_active = false;
    res.sendStatus(204);
  });

  app.get("/api/sessions/athlete/:athleteId", (req, res) => {
    res.json(sessions.filter(s => s.athlete_id === req.params.athleteId));
  });

  app.post("/api/sessions/bulk", (req, res) => {
    const { athleteId, sessions: newSessions } = req.body;
    const formatted = newSessions.map((s: any) => ({
      ...s,
      id: Math.random().toString(36).substr(2, 9),
      athlete_id: athleteId,
      status: 'SCHEDULED'
    }));
    sessions = [...sessions, ...formatted];
    res.sendStatus(201);
  });

  app.put("/api/sessions/:id", (req, res) => {
    const index = sessions.findIndex(s => s.id === req.params.id);
    if (index !== -1) {
      sessions[index] = { ...sessions[index], ...req.body };
    }
    res.sendStatus(204);
  });

  app.delete("/api/sessions/:id", (req, res) => {
    sessions = sessions.filter(s => s.id !== req.params.id);
    res.sendStatus(204);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
