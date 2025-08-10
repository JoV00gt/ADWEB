import { formatDate } from "@/app/lib/utils/format-date";

describe('format dates', () => {
  test('formats a given UTC date in yyyy-MM-dd format', () => {
    const input = new Date('2023-12-25T12:00:00Z');
    const result = formatDate(input);

    expect(result).toBe('2023-12-25');
  });
});
