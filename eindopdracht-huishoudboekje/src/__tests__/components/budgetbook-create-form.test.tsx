import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as actions from '@/app/lib/actions/budgetbook-actions';
import { useParticipants as mockUseParticipants } from '@/app/lib/hooks/useParticipants';
import BudgetBookForm from '@/app/components/budgetbook-create-form';

jest.mock('@/app/lib/actions/budgetbook-actions', () => ({
  createBudgetBook: jest.fn(),
}));

jest.mock('@/app/lib/hooks/useParticipants');

describe('BudgetBookForm', () => {
  const mockCreate = actions.createBudgetBook as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    let selectedUserIds: string[] = [];
    (mockUseParticipants as jest.Mock).mockImplementation(() => ({
      currentUserId: 'user123',
      filteredUsers: [
        { id: 'u1', email: 'user1@example.com' },
        { id: 'u2', email: 'user2@example.com' },
      ],
      selectedUserIds,
      setSelectedUserIds: (ids: string[]) => {
        selectedUserIds = ids;
      },
    }));
  });

  test('renders form fields', () => {
    render(<BudgetBookForm />);
    expect(screen.getByLabelText('Naam *')).toBeInTheDocument();
    expect(screen.getByLabelText('Omschrijving')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Opslaan" })).toBeInTheDocument();
    expect(screen.getByLabelText('Deelnemers')).toBeInTheDocument();
  });

test('calls createBudgetBook on submit with participants', async () => {
  render(<BudgetBookForm />);

  await userEvent.type(screen.getByLabelText('Naam *'), 'Test Budget');
  await userEvent.type(screen.getByLabelText('Omschrijving'), 'Some description');

  const select = screen.getByLabelText('Deelnemers') as HTMLSelectElement;
  select.options[0].selected = true;
  select.options[1].selected = true;
  fireEvent.change(select);

  await userEvent.click(screen.getByRole('button', { name: "Opslaan" }));

  await waitFor(() => {
    expect(mockCreate).toHaveBeenCalled();
    const formData = mockCreate.mock.calls[0][0] as FormData;
    expect(formData.get('name')).toBe('Test Budget');
    expect(formData.get('description')).toBe('Some description');
    expect(mockCreate).toHaveBeenCalledWith(expect.any(FormData), 'user123');
  });
});

test('shows default error message when error has no message', async () => {
  mockCreate.mockRejectedValueOnce({});

  render(<BudgetBookForm />);

  await userEvent.type(screen.getByLabelText('Naam *'), 'Test Budget');
  await userEvent.click(screen.getByRole('button', { name: "Opslaan" }));

  await waitFor(() => {
    expect(screen.getByText('Er ging iets mis.')).toBeInTheDocument();
  });
});


});
