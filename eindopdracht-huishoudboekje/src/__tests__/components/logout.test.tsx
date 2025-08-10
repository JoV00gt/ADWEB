import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { logout } from '@/app/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/app/components/auth/logout-button';

jest.mock('@/app/lib/actions/auth-actions', () => ({
  logout: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('LogoutButton', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test('calls logout and redirects to login on success', async () => {
    (logout as jest.Mock).mockResolvedValueOnce(undefined);

    render(<LogoutButton />);

    await userEvent.click(screen.getByRole('button', { name: "Uitloggen" }));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  test('logs error to console if logout fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (logout as jest.Mock).mockRejectedValueOnce(new Error('Failed'));

    render(<LogoutButton />);

    await userEvent.click(screen.getByRole('button', { name: "Uitloggen" }));

    expect(logout).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Logout failed',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
