
import { Athlete } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

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

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/athletes/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Sporcu tamamen silinemedi');
  }
};
