import express from 'express';
import cors from 'cors';
import pool from './db/pool.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============ ATHLETES ============
app.get('/api/athletes', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, phone, notes, is_active, created_at 
       FROM athletes 
       WHERE deleted_at IS NULL 
       ORDER BY name`
    );
    res.json(rows.map(r => ({
      ...r,
      created_at: r.created_at?.toISOString?.() || r.created_at
    })));
  } catch (err) {
    console.error('GET /api/athletes:', err);
    res.status(500).json({ error: 'Sporcular yüklenemedi' });
  }
});

app.post('/api/athletes', async (req, res) => {
  try {
    const { name, phone, is_active = true } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO athletes (name, phone, is_active) VALUES ($1, $2, $3) 
       RETURNING id, name, phone, notes, is_active, created_at`,
      [name, phone || null, is_active]
    );
    const r = rows[0];
    res.status(201).json({
      ...r,
      created_at: r.created_at?.toISOString?.() || r.created_at
    });
  } catch (err) {
    console.error('POST /api/athletes:', err);
    res.status(500).json({ error: 'Sporcu oluşturulamadı' });
  }
});

app.post('/api/athletes/:id/soft-delete', async (req, res) => {
  try {
    await pool.query(
      `UPDATE athletes SET deleted_at = NOW(), is_active = false WHERE id = $1`,
      [req.params.id]
    );
    res.status(204).send();
  } catch (err) {
    console.error('POST /api/athletes/:id/soft-delete:', err);
    res.status(500).json({ error: 'Sporcu silinemedi' });
  }
});

app.delete('/api/athletes/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM athletes WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /api/athletes/:id:', err);
    res.status(500).json({ error: 'Sporcu silinemedi' });
  }
});

// ============ SESSIONS ============
app.get('/api/sessions/athlete/:athleteId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, athlete_id, date::text, time, duration, status, original_date::text, notes
       FROM sessions 
       WHERE athlete_id = $1 
       ORDER BY date, time`,
      [req.params.athleteId]
    );
    res.json(rows.map(r => ({
      ...r,
      originalDate: r.original_date || undefined
    })));
  } catch (err) {
    console.error('GET /api/sessions/athlete/:id:', err);
    res.status(500).json({ error: 'Seanslar yüklenemedi' });
  }
});

app.post('/api/sessions/bulk', async (req, res) => {
  try {
    const { athleteId, sessions } = req.body;
    for (const s of sessions) {
      await pool.query(
        `INSERT INTO sessions (athlete_id, date, time, duration, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [athleteId, s.date, s.time, s.duration || 60, s.status || 'SCHEDULED']
      );
    }
    res.status(201).send();
  } catch (err) {
    console.error('POST /api/sessions/bulk:', err);
    res.status(500).json({ error: 'Toplu seans oluşturulamadı' });
  }
});

app.put('/api/sessions/:id', async (req, res) => {
  try {
    const { date, time, duration, status, notes } = req.body;
    await pool.query(
      `UPDATE sessions 
       SET date = $1, time = $2, duration = $3, status = $4, notes = $5 
       WHERE id = $6`,
      [date, time, duration || 60, status || 'SCHEDULED', notes || null, req.params.id]
    );
    res.status(204).send();
  } catch (err) {
    console.error('PUT /api/sessions/:id:', err);
    res.status(500).json({ error: 'Seans güncellenemedi' });
  }
});

app.delete('/api/sessions/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM sessions WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /api/sessions/:id:', err);
    res.status(500).json({ error: 'Seans silinemedi' });
  }
});

// Veritabanı tablolarını oluştur ve sunucuyu başlat
async function start() {
  try {
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
      console.log('Veritabanı tabloları hazır.');
    }
  } catch (err) {
    console.error('DB init uyarısı (tablolar zaten var olabilir):', err.message);
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`API http://0.0.0.0:${PORT} üzerinde çalışıyor`);
  });
}

start();
