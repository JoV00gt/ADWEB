import { renderHook, act } from '@testing-library/react';
import { useDashboardData } from '@/app/lib/hooks/useDashboardData';

import * as authActions from '@/app/lib/actions/auth-actions';
import * as bookListeners from '@/app/lib/listeners/budgetbook-listener';
import * as transactionListeners from '@/app/lib/listeners/transaction-listener';
import * as categoryListeners from '@/app/lib/listeners/category-listener';

jest.mock('@/app/lib/actions/auth-actions');
jest.mock('@/app/lib/listeners/budgetbook-listener');
jest.mock('@/app/lib/listeners/transaction-listener');
jest.mock('@/app/lib/listeners/category-listener');

describe('useDashboardData', () => {
  const mockUserId = 'user123';
  const mockBooks = [
    { id: '1', name: 'Book 1', archived: false },
    { id: '2', name: 'Book 2', archived: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (authActions.getUserId as jest.Mock).mockResolvedValue(mockUserId);
  });

  test('fetches userId and listens to non-archived budgetbooks', async () => {
    const unsubscribeBooks = jest.fn();
    (bookListeners.listenBudgetBooks as jest.Mock).mockImplementation((listener) => {
      listener(mockBooks);
      return unsubscribeBooks;
    });

    const unsubscribeTx = jest.fn();
    (transactionListeners.listenTransactions as jest.Mock).mockReturnValue(unsubscribeTx);

    const unsubscribeCat = jest.fn();
    (categoryListeners.listenCategories as jest.Mock).mockReturnValue(unsubscribeCat);

    const { result, unmount } = renderHook(() => useDashboardData(false));

    await act(async () => {});

    expect(authActions.getUserId).toHaveBeenCalled();
    expect(bookListeners.listenBudgetBooks).toHaveBeenCalledWith(expect.any(Function), mockUserId);

    expect(result.current.budgetBooks).toEqual([{ id: '1', name: 'Book 1', archived: false }]);
    expect(result.current.selectedBook).toEqual({ id: '1', name: 'Book 1', archived: false });

    expect(transactionListeners.listenTransactions).toHaveBeenCalledWith(
      expect.any(Function),
      '1',
      new Date().getMonth()
    );

    expect(categoryListeners.listenCategories).toHaveBeenCalledWith(expect.any(Function), '1');

    unmount();

    expect(unsubscribeBooks).toHaveBeenCalled();
    expect(unsubscribeTx).toHaveBeenCalled();
    expect(unsubscribeCat).toHaveBeenCalled();
  });

  test('does not set selectedBook if no budgetBooks match archived flag', async () => {
    (bookListeners.listenBudgetBooks as jest.Mock).mockImplementation((listener) => {
      listener([]);
      return jest.fn();
    });

    const { result } = renderHook(() => useDashboardData(false));
    await act(async () => {});

    expect(result.current.selectedBook).toBe(null);
  });

  test('skips setup if no userId returned', async () => {
    (authActions.getUserId as jest.Mock).mockResolvedValue(null);
    const { result } = renderHook(() => useDashboardData(false));

    await act(async () => {});
    expect(result.current.userId).toBe(null);
    expect(bookListeners.listenBudgetBooks).not.toHaveBeenCalled();
  });
});
