import { supabase } from '../lib/supabase';
import { Session, SessionStatus } from '../types';

export const sessionService = {
  async getAll(): Promise<Session[]> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) throw error;
    
    return (data || []).map(row => ({
      id: row.id,
      date: row.date,
      time: row.time,
      duration: row.duration,
      status: row.status as SessionStatus,
      originalDate: row.original_date,
      notes: row.notes
    }));
  },

  async createBulk(sessions: Omit<Session, 'id' | 'status'>[]): Promise<void> {
    const rows = sessions.map(s => ({
      date: s.date,
      time: s.time,
      duration: s.duration,
      status: 'SCHEDULED'
    }));

    const { error } = await supabase.from('sessions').insert(rows);
    if (error) throw error;
  },

  async update(session: Session): Promise<void> {
    const { error } = await supabase
      .from('sessions')
      .update({
        date: session.date,
        time: session.time,
        duration: session.duration,
        status: session.status,
        original_date: session.originalDate,
        notes: session.notes
      })
      .eq('id', session.id);

    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('sessions').delete().eq('id', id);
    if (error) throw error;
  }
};