
import { Session, SessionStatus } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const sessionService = {
  async getByAthlete(athleteId: string): Promise<Session[]> {
    const response = await fetch(`${API_URL}/sessions/athlete/${athleteId}`);
    if (!response.ok) throw new Error('Seanslar yüklenemedi');
    return response.json();
  },

  async createBulk(athleteId: string, sessions: Omit<Session, 'id' | 'status' | 'athlete_id'>[]): Promise<void> {
    const response = await fetch(`${API_URL}/sessions/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ athleteId, sessions })
    });
    if (!response.ok) throw new Error('Toplu seans oluşturulamadı');
  },

  async update(session: Session): Promise<void> {
    const response = await fetch(`${API_URL}/sessions/${session.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    });
    if (!response.ok) throw new Error('Seans güncellenemedi');
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/sessions/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Seans silinemedi');
  }
};
