import { renderHook, act } from '@testing-library/react';
import * as authActions from '@/app/lib/actions/auth-actions';
import * as listeners from '@/app/lib/listeners/budgetbook-listener';
import { useArchivedBudgetBooks } from '@/app/lib/hooks/useArchivedBooks';

jest.mock('@/app/lib/actions/auth-actions');
jest.mock('@/app/lib/listeners/budgetbook-listener');

describe('useArchivedBudgetBooks', () => {
  const mockBooks = [
    { id: '1', name: 'Archived Book 1' },
    { id: '2', name: 'Archived Book 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (authActions.getUserId as jest.Mock).mockResolvedValue('user123');
  });

  test('fetches user ID and listens to archived books', async () => {
    (listeners.listenArchivedBudgetBooks as jest.Mock).mockImplementation((listener) => {
      listener(mockBooks);
      return jest.fn();
    });

    const { result } = renderHook(() => useArchivedBudgetBooks());
    await act(async () => {});

    expect(authActions.getUserId).toHaveBeenCalled();
    expect(listeners.listenArchivedBudgetBooks).toHaveBeenCalledWith(expect.any(Function), 'user123');
    expect(result.current.userId).toBe('user123');
    expect(result.current.budgetBooks).toEqual(mockBooks);
    expect(result.current.loading).toBe(false);
  });

  test('sets loading false if no user ID', async () => {
    (authActions.getUserId as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useArchivedBudgetBooks());
    await act(async () => {});

    expect(result.current.loading).toBe(false);
    expect(result.current.userId).toBe(null);
    expect(result.current.budgetBooks).toEqual([]);
  });

  test('cleans up listener on unmount', async () => {
    const unsubscribeMock = jest.fn();
    (listeners.listenArchivedBudgetBooks as jest.Mock).mockImplementation((listener) => {
      listener(mockBooks);
      return unsubscribeMock;
    });

    const { unmount } = renderHook(() => useArchivedBudgetBooks());

    await act(async () => {});
    unmount();

    expect(unsubscribeMock).toHaveBeenCalled();
  });
});
