
import { supabase } from '../lib/supabase';
import { Session, SessionStatus } from '../types';

export const sessionService = {
  async getByAthlete(athleteId: string): Promise<Session[]> {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('athlete_id', athleteId)
      .order('date', { ascending: true })
      .order('time', { ascending: true });

    if (error) throw error;
    
    return (data || []).map(row => ({
      id: row.id,
      athlete_id: row.athlete_id,
      date: row.date,
      time: row.time,
      duration: row.duration,
      status: row.status as SessionStatus,
      originalDate: row.original_date,
      notes: row.notes
    }));
  },

  async createBulk(athleteId: string, sessions: Omit<Session, 'id' | 'status' | 'athlete_id'>[]): Promise<void> {
    const rows = sessions.map(s => ({
      athlete_id: athleteId,
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
