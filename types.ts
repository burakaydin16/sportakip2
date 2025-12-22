export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  ATTENDED = 'ATTENDED',
  MISSED = 'MISSED',
  INSTRUCTOR_CANCELLED = 'INSTRUCTOR_CANCELLED',
  RESCHEDULED = 'RESCHEDULED' // Used for history, but active session usually just changes date
}

export interface Session {
  id: string;
  date: string; // ISO String for the date part YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // Minutes
  status: SessionStatus;
  originalDate?: string; // If rescheduled, keep track of original
  notes?: string;
}

export interface DayOfWeekOption {
  value: number; // 0-6 (Sunday-Saturday)
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

export interface StatsSummary {
  total: number;
  attended: number;
  missed: number;
  cancelled: number;
  attendanceRate: number;
}