import { format, toZonedTime, } from 'date-fns-tz';

export function formatDate(dateInput: Date): string {
  const date = new Date(dateInput);
  const timeZone = 'Europe/Amsterdam';

  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, 'yyyy-MM-dd', { timeZone });
}