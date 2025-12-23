
export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  ATTENDED = 'ATTENDED',
  MISSED = 'MISSED',
  INSTRUCTOR_CANCELLED = 'INSTRUCTOR_CANCELLED',
  RESCHEDULED = 'RESCHEDULED'
}

export interface Athlete {
  id: string;
  name: string;
  phone?: string;
  notes?: string;
  created_at: string;
}

export interface Session {
  id: string;
  athlete_id: string;
  date: string;
  time: string;
  duration: number;
  status: SessionStatus;
  originalDate?: string;
  notes?: string;
}

export interface DayOfWeekOption {
  value: number;
  label: string;
}

export const DAYS_OF_WEEK: DayOfWeekOption[] = [
  { value: 1, label: 'Pazartesi' },
  { value: 2, label: 'Salı' },
  { value: 3, label: 'Çarşamba' },
  { value: 4, label: 'Perşembe' },
  { value: 5, label: 'Cuma' },
  { value: 6, label: 'Cumartesi' },
  { value: 0, label: 'Pazar' },
];
