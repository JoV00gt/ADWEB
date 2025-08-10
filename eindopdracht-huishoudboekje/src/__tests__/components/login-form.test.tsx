import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { login } from '@/app/lib/actions/auth-actions';
import { useRouter } from 'next/navigation';
import LoginForm from '@/app/components/auth/login-form';

jest.mock('@/app/lib/actions/auth-actions', () => ({
  login: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/app/components/error', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) =>
    message ? <p data-testid="error">{message}</p> : null,
}));

describe('LoginForm', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test('renders form inputs', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByLabelText("Wachtwoord")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Inloggen" })).toBeInTheDocument();
  });

  test('successful login redirects to dashboard', async () => {
    (login as jest.Mock).mockResolvedValueOnce(undefined);

    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText("E-mail"), 'test@example.com');
    await userEvent.type(screen.getByLabelText("Wachtwoord"), 'password123');

    await userEvent.click(screen.getByRole('button', { name: "Inloggen" }));

    expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  test('failed login shows error message', async () => {
    (login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText("E-mail"), 'wrong@example.com');
    await userEvent.type(screen.getByLabelText("Wachtwoord"), 'wrongpass');

    await userEvent.click(screen.getByRole('button', { name: "Inloggen" }));

    expect(login).toHaveBeenCalledWith('wrong@example.com', 'wrongpass');
    expect(await screen.findByTestId('error')).toHaveTextContent(
      'Login mislukt. Controleer je gegevens.'
    );
  });
});
