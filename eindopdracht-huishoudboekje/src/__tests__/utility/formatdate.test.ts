import { formatDate } from "@/app/lib/utils/format-date";

describe('formatDate', () => {
  test('formats a given UTC date in yyyy-MM-dd format', () => {
    const input = new Date('2023-12-25T12:00:00Z');
    const result = formatDate(input);

    expect(result).toBe('2023-12-25');
  });

  test('returns empty string when input is null', () => {
    const result = formatDate(null as unknown as Date);
    expect(result).toBe('');
  });

  test('returns empty string when input is invalid date string', () => {
    const result = formatDate('not-a-date');
    expect(result).toBe('');
  });
});
