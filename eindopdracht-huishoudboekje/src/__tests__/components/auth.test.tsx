import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/app/lib/context/auth-context';
import { onAuthStateChanged } from 'firebase/auth';

const mockUser = { uid: '123', email: 'test@example.com' };

jest.mock('firebase/auth', () => {
  const originalModule = jest.requireActual('firebase/auth');
  return {
    ...originalModule,
    onAuthStateChanged: jest.fn((auth, callback) => {
      setTimeout(() => {
        if (typeof callback === 'function') {
          callback(mockUser);
        } else if (callback && typeof callback.next === 'function') {
          callback.next(mockUser);
        }
      }, 0);
      return () => {};
    }),
  };
});

describe('AuthProvider & useAuth', () => {
  function Consumer() {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (user) return <div>Welcome, {user.email}</div>;
    return <div>Please login</div>;
  }

  test('shows loading spinner initially', () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );
   expect(screen.getByLabelText("loading")).toBeInTheDocument();
  });

  test('shows welcome message when user is logged in', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    const welcomeMessage = await screen.findByText("Welcome, " + mockUser.email);
    expect(welcomeMessage).toBeInTheDocument();
  });

  test('shows login prompt when no user', async () => {
    (onAuthStateChanged as jest.Mock).mockImplementationOnce((auth, callback) => {
      setTimeout(() => {
        if (typeof callback === 'function') {
          callback(null);
        } else if (callback && typeof callback.next === 'function') {
          callback.next(null);
        }
      }, 0);
      return () => {};
    });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    const loginPrompt = await screen.findByText("Please login");
    expect(loginPrompt).toBeInTheDocument();
  });
});
