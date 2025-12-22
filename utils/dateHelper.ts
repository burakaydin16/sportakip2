export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number) => {
  // 0 = Sunday, 1 = Monday. We want 0 = Monday for display usually, but standard JS is 0=Sun.
  return new Date(year, month, 1).getDay();
};

export const formatDateISO = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const parseDateISO = (isoDate: string): Date => {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d);
};

export const isSameDay = (d1: Date, d2: Date): boolean => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const generateRecurringDates = (
  startDate: string,
  endDate: string,
  selectedDays: number[] // 0-6
): string[] => {
  const dates: string[] = [];
  let current = parseDateISO(startDate);
  const end = parseDateISO(endDate);

  // Safety break to prevent infinite loops if dates are wrong
  let safetyCounter = 0;
  while (current <= end && safetyCounter < 366) {
    if (selectedDays.includes(current.getDay())) {
      dates.push(formatDateISO(current));
    }
    current = addDays(current, 1);
    safetyCounter++;
  }
  return dates;
};