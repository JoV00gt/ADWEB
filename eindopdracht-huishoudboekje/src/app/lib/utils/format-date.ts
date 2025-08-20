import { format, toZonedTime } from 'date-fns-tz';

export function formatDate(dateInput?: Date | string): string {
  if (!dateInput) return '';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const timeZone = 'Europe/Amsterdam';
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, 'yyyy-MM-dd', { timeZone });
}
