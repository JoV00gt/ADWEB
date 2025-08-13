import { BudgetBook } from '@/app/lib/definitions';
import { useBudgetBooks } from '@/app/lib/hooks/useBudgetBooks';
import { listenBudgetBooks } from '@/app/lib/listeners/budgetbook-listener';
import { renderHook, act } from '@testing-library/react';
import { Timestamp } from 'firebase/firestore';

jest.mock('@/app/lib/listeners/budgetbook-listener');

const mockBooks: BudgetBook[] = [
  {
    id: '1',
    name: 'Book 1',
    archived: false,
    ownerId: 'user1',
    description: '',
    participants: [],
    createdAt: Timestamp.fromDate(new Date()),
  },
  {
    id: '2',
    name: 'Book 2',
    archived: true,
    ownerId: 'user1',
    description: '',
    participants: [],
    createdAt: Timestamp.fromDate(new Date()),
  },
  {
    id: '3',
    name: 'Book 3',
    archived: false,
    ownerId: 'user1',
    description: '',
    participants: [],
    createdAt: Timestamp.fromDate(new Date()),
  },
];

describe('useBudgetBooks', () => {
  let mockListenBudgetBooks: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockListenBudgetBooks = listenBudgetBooks as jest.Mock;
    mockListenBudgetBooks.mockImplementation(() => () => {});
  });

  test('returns empty array initially', () => {
    const { result } = renderHook(() => useBudgetBooks(false, 'user1'));
    expect(result.current).toEqual([]);
  });

  test('does not call listener if userId is null', () => {
    renderHook(() => useBudgetBooks(false, null));
    expect(mockListenBudgetBooks).not.toHaveBeenCalled();
  });

  test('calls listenBudgetBooks with callback and userId', () => {
    renderHook(() => useBudgetBooks(false, 'user1'));
    expect(mockListenBudgetBooks).toHaveBeenCalledTimes(1);
    expect(typeof mockListenBudgetBooks.mock.calls[0][0]).toBe('function');
    expect(mockListenBudgetBooks.mock.calls[0][1]).toBe('user1');
  });

  test('updates budgetBooks when listener calls callback', () => {
    let callbackFn: (books: BudgetBook[]) => void = () => {};

    mockListenBudgetBooks.mockImplementation((cb) => {
      callbackFn = cb;
      return () => {};
    });

    const { result } = renderHook(() => useBudgetBooks(false, 'user1'));

    act(() => {
      callbackFn(mockBooks);
    });

    expect(result.current).toEqual([
      mockBooks[0],
      mockBooks[2],
    ]);
  });

  test('calls unsubscribe on unmount', () => {
    const unsubscribeMock = jest.fn();
    mockListenBudgetBooks.mockImplementation(() => unsubscribeMock);

    const { unmount } = renderHook(() => useBudgetBooks(false, 'user1'));
    unmount();

    expect(unsubscribeMock).toHaveBeenCalledTimes(1);
  });
});
