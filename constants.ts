import { SessionStatus } from './types';

export const STATUS_LABELS: Record<SessionStatus, string> = {
  [SessionStatus.SCHEDULED]: 'Planlandı',
  [SessionStatus.ATTENDED]: 'Katıldım',
  [SessionStatus.MISSED]: 'Gitmedim',
  [SessionStatus.INSTRUCTOR_CANCELLED]: 'Hoca İptal/Gelmedi',
  [SessionStatus.RESCHEDULED]: 'Ertelendi',
};

export const STATUS_COLORS: Record<SessionStatus, string> = {
  [SessionStatus.SCHEDULED]: 'bg-gray-100 text-gray-700 border-gray-200',
  [SessionStatus.ATTENDED]: 'bg-green-100 text-green-700 border-green-200',
  [SessionStatus.MISSED]: 'bg-red-100 text-red-700 border-red-200',
  [SessionStatus.INSTRUCTOR_CANCELLED]: 'bg-orange-100 text-orange-700 border-orange-200',
  [SessionStatus.RESCHEDULED]: 'bg-blue-100 text-blue-700 border-blue-200',
};

export const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];