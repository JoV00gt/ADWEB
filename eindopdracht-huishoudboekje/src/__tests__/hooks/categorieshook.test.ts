import { renderHook, act } from '@testing-library/react';
import { listenCategories } from '@/app/lib/listeners/category-listener';
import type { Category } from '@/app/lib/definitions';
import { useCategories } from '@/app/lib/hooks/useCategories';

jest.mock('@/app/lib/listeners/category-listener');

const mockCategories: Category[] = [
  { id: '1', name: 'Food', budget: 200, budgetBookId: 'b1' },
  { id: '2', name: 'Transport', budget: 400, budgetBookId: 'b1' },
];

describe('useCategories', () => {
  let mockListenCategories: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockListenCategories = listenCategories as jest.Mock;
    mockListenCategories.mockImplementation(() => () => {});
  });

  test('returns empty array initially', () => {
    const { result } = renderHook(() => useCategories('book1'));
    expect(result.current).toEqual([]);
  });

  test('calls listenCategories with setCategories and budgetBookId', () => {
    renderHook(() => useCategories('book1'));
    expect(mockListenCategories).toHaveBeenCalledTimes(1);
    expect(typeof mockListenCategories.mock.calls[0][0]).toBe('function');
    expect(mockListenCategories.mock.calls[0][1]).toBe('book1');
  });

  test('updates categories when listener calls setCategories', () => {
    let setCategoriesFn: (cats: Category[]) => void = () => {};

    mockListenCategories.mockImplementation((setCats) => {
      setCategoriesFn = setCats;
      return () => {};
    });

    const { result } = renderHook(() => useCategories('book1'));

    act(() => {
      setCategoriesFn(mockCategories);
    });

    expect(result.current).toEqual(mockCategories);
  });

  test('does not call listener if budgetBookId is null', () => {
    renderHook(() => useCategories(null));
    expect(mockListenCategories).not.toHaveBeenCalled();
  });

  test('calls unsubscribe on unmount', () => {
    const unsubscribeMock = jest.fn();
    mockListenCategories.mockImplementation(() => unsubscribeMock);

    const { unmount } = renderHook(() => useCategories('book1'));
    unmount();

    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });
});
