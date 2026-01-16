
import { supabase } from '../lib/supabase';
import { Athlete } from '../types';

export const athleteService = {
  async getAll(): Promise<Athlete[]> {
    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .eq('is_active', true) // Sadece aktif olanlar
      .order('name', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async create(name: string, phone?: string): Promise<Athlete> {
    const { data, error } = await supabase
      .from('athletes')
      .insert([{ name, phone, is_active: true }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async softDelete(id: string): Promise<void> {
    const { error } = await supabase
      .from('athletes')
      .update({ is_active: false })
      .eq('id', id);
    if (error) throw error;
  },

  async delete(id: string): Promise<void> {
    // Gerçekten silmek isterseniz diye kalsın
    const { error } = await supabase.from('athletes').delete().eq('id', id);
    if (error) throw error;
  }
};
