import { render, screen } from '@testing-library/react';
import { useAuth } from '@/app/lib/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import AuthGuard from '@/app/components/auth/auth-guard';

jest.mock('@/app/lib/context/auth-context', () => ({
  useAuth: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('@/app/components/spinner', () => ({
  Spinner: jest.fn(() => <div>Loading...</div>),
}));

describe('AuthGuard', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test('renders spinner when loading', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: true });
    (usePathname as jest.Mock).mockReturnValue('/dashboard');

    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('renders children when user is authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: 'u1' }, loading: false });
    (usePathname as jest.Mock).mockReturnValue('/dashboard');

    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>
    );

    expect(screen.getByText('Protected')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('redirects to login when not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });
    (usePathname as jest.Mock).mockReturnValue('/dashboard');

    render(
      <AuthGuard>
        <div>Protected</div>
      </AuthGuard>
    );

    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  test('does not redirect when already login page', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null, loading: false });
    (usePathname as jest.Mock).mockReturnValue('/auth/login');

    render(
      <AuthGuard>
        <div>Login page</div>
      </AuthGuard>
    );

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
