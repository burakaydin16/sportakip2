
import { supabase } from '../lib/supabase';
import { Athlete } from '../types';

export const athleteService = {
  async getAll(): Promise<Athlete[]> {
    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(name: string, phone?: string): Promise<Athlete> {
    const { data, error } = await supabase
      .from('athletes')
      .insert([{ name, phone }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('athletes').delete().eq('id', id);
    if (error) throw error;
  }
};
