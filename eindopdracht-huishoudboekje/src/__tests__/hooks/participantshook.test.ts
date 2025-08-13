// __tests__/hooks/useParticipants.test.ts
import { renderHook, act } from '@testing-library/react';
import { useParticipants } from '@/app/lib/hooks/useParticipants';
import * as authActions from '@/app/lib/actions/auth-actions';
import * as listeners from '@/app/lib/listeners/user-listener';

jest.mock('@/app/lib/actions/auth-actions');
jest.mock('@/app/lib/listeners/user-listener');

describe('useParticipants', () => {
  const mockUsers = [
    { id: '1', email: 'test1@example.com' },
    { id: '2', email: 'test2@example.com' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    (authActions.getUserId as jest.Mock).mockResolvedValue('1');
    (listeners.listenToUsers as jest.Mock).mockImplementation((listener: any) => {
      listener(mockUsers);
      return jest.fn();
    });
  });

  test('fetches user ID and filters users', async () => {
    const { result } = renderHook(() => useParticipants());
    await act(async () => {});

    expect(authActions.getUserId).toHaveBeenCalled();
    expect(listeners.listenToUsers).toHaveBeenCalled();

    expect(result.current.currentUserId).toBe('1');
    expect(result.current.filteredUsers).toEqual([
      { id: '2', email: 'test2@example.com' },
    ]);
  });

  test('updates selectedUserIds', async () => {
    const { result } = renderHook(() => useParticipants());

    await act(async () => {
      result.current.setSelectedUserIds(['1', '2']);
    });

    expect(result.current.selectedUserIds).toEqual(['1', '2']);
  });

  test('unsubscribes on unmount', async () => {
    const mockUnsubscribe = jest.fn();

    (listeners.listenToUsers as jest.Mock).mockImplementation(cb => {
      cb(mockUsers);
      return mockUnsubscribe;
    });

    const { unmount } = renderHook(() => useParticipants());

    await act(async () => {});
    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
