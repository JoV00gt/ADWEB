import { BudgetBook } from '@/app/lib/definitions';
import { useSelectedBook } from '@/app/lib/hooks/useSelectedBook';
import { renderHook, act } from '@testing-library/react';
import { Timestamp } from 'firebase/firestore';

describe('useSelectedBook', () => {
  const mockBooks: BudgetBook[] = [
    {
        id: 'b1', name: 'Book 1', ownerId: 'u1',
        description: '',
        archived: false,
        participants: [],
        createdAt: Timestamp.fromDate(new Date())
    },
    {
        id: 'b2', name: 'Book 2', ownerId: 'u1',
        description: '',
        archived: false,
        participants: [],
        createdAt: Timestamp.fromDate(new Date())
    },
  ];

  test('returns null initially if no budgetBooks', () => {
    const { result } = renderHook(() => useSelectedBook([]));
    expect(result.current.selectedBook).toBeNull();
  });

  test('selects first book if none selected', () => {
    const { result } = renderHook(() => useSelectedBook(mockBooks));
    expect(result.current.selectedBook).toEqual(mockBooks[0]);
  });

  test('keeps existing selection when budgetBooks changes', () => {
    const { result, rerender } = renderHook(
      ({ data }) => useSelectedBook(data),
      { initialProps: { data: mockBooks } }
    );

    act(() => {
      result.current.setSelectedBook(mockBooks[1]);
    });

    rerender({ data: mockBooks });

    expect(result.current.selectedBook).toEqual(mockBooks[1]);
  });

  test('allows manual selection', () => {
    const { result } = renderHook(() => useSelectedBook(mockBooks));
    act(() => {
      result.current.setSelectedBook(mockBooks[1]);
    });
    expect(result.current.selectedBook).toEqual(mockBooks[1]);
  });
});
