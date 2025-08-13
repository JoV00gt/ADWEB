import { renderHook, waitFor } from '@testing-library/react';
import { useUser } from '@/app/lib/hooks/useUser';
import { getUserId } from '@/app/lib/actions/auth-actions';

jest.mock('@/app/lib/actions/auth-actions', () => ({
  getUserId: jest.fn(),
}));

describe('useUser', () => {
  test('fetches and sets the userId', async () => {
    (getUserId as jest.Mock).mockResolvedValue('user123');

    const { result } = renderHook(() => useUser());

    expect(result.current).toBeNull();

    await waitFor(() => {
      expect(result.current).toBe('user123');
    });

    expect(getUserId).toHaveBeenCalledTimes(1);
  });

  test('sets null if no user is returned', async () => {
    (getUserId as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useUser());

    await waitFor(() => {
      expect(result.current).toBeNull();
    });

    expect(getUserId).toHaveBeenCalledTimes(2);
  });
});
