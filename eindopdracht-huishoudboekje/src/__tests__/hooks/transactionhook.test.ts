import { Transaction } from '@/app/lib/definitions';
import { useTransactions } from '@/app/lib/hooks/useTransactions';
import { listenTransactions } from '@/app/lib/listeners/transaction-listener';
import { renderHook, act } from '@testing-library/react';

jest.mock('@/app/lib/listeners/transaction-listener', () => ({
  listenTransactions: jest.fn(),
}));

const mockTransactions: Transaction[] = [
  { id: 't1', amount: 100, date: new Date(), type: 'uitgave', categoryId: 'c1' },
];

describe('useTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not call listenTransactions if selectedBookId is null', () => {
    renderHook(() => useTransactions(null, 8));
    expect(listenTransactions).not.toHaveBeenCalled();
  });

  test('subscribes to transactions when selectedBookId is provided', () => {
    const mockUnsubscribe = jest.fn();
    (listenTransactions as jest.Mock).mockImplementation(() => mockUnsubscribe);

    renderHook(() => useTransactions('book1', 8));

    expect(listenTransactions).toHaveBeenCalledWith(expect.any(Function), 'book1', 8);
  });

  test('updates transactions when listener callback is called', () => {
    let callback: (txs: Transaction[]) => void = () => {};
    (listenTransactions as jest.Mock).mockImplementation((cb) => {
      callback = cb;
      return jest.fn();
    });

    const { result } = renderHook(() => useTransactions('book1', 8));

    act(() => {
      callback(mockTransactions);
    });

    expect(result.current).toEqual(mockTransactions);
  });

  test('calls unsubscribe on unmount', () => {
    const mockUnsubscribe = jest.fn();
    (listenTransactions as jest.Mock).mockImplementation(() => mockUnsubscribe);

    const { unmount } = renderHook(() => useTransactions('book1', 8));
    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
