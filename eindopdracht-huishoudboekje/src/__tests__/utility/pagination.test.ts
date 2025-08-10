import { paginate } from "@/app/lib/utils/pagination";

const mockItems = Array.from({ length: 10 }, (_, i) => `Item ${i + 1}`);

describe('paginate utility', () => {
  test('returns correct items and total pages for page 1', () => {
    const { paginatedItems, totalPages } = paginate(mockItems, 1, 3);

    expect(paginatedItems).toEqual(['Item 1', 'Item 2', 'Item 3']);
    expect(totalPages).toBe(4);
  });

  test('returns correct items for page 2', () => {
    const { paginatedItems } = paginate(mockItems, 2, 4);
    expect(paginatedItems).toEqual(['Item 5', 'Item 6', 'Item 7', 'Item 8']);
  });

  test('returns correct items for the last page with fewer items', () => {
    const { paginatedItems } = paginate(mockItems, 4, 3);
    expect(paginatedItems).toEqual(['Item 10']);
  });

  test('returns empty array if currentPage is out of bounds', () => {
    const { paginatedItems } = paginate(mockItems, 5, 3);
    expect(paginatedItems).toEqual([]);
  });

  test('returns all items if itemsPerPage equals 1', () => {
    const { paginatedItems, totalPages } = paginate(mockItems, 1, 20);
    expect(paginatedItems).toEqual(mockItems);
    expect(totalPages).toBe(1);
  });

  test('returns empty array for empty input list', () => {
    const { paginatedItems, totalPages } = paginate([], 1, 5);
    expect(paginatedItems).toEqual([]);
    expect(totalPages).toBe(0);
  });
});
