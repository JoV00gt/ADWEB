import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { getUserId } from '@/app/lib/actions/auth-actions';
import { listenToUsers } from '@/app/lib/listeners/user-listener';
import { updateBudgetBook } from '@/app/lib/actions/budgetbook-actions';
import type { BudgetBook, User } from '@/app/lib/definitions';
import EditBudgetBookForm from '@/app/components/budgetbook-edit-form';
import { Timestamp } from 'firebase/firestore';

jest.mock('@/app/lib/actions/auth-actions', () => ({
  getUserId: jest.fn(),
}));
jest.mock('@/app/lib/listeners/user-listener', () => ({
  listenToUsers: jest.fn(),
}));
jest.mock('@/app/lib/actions/budgetbook-actions', () => ({
  updateBudgetBook: jest.fn(),
}));

const mockUser: User = { id: '1', email: 'current@user.com', name: 'Current User' };
const mockOtherUsers: User[] = [
  { id: '2', email: 'alice@example.com', name: 'Alice' },
  { id: '3', email: 'bob@example.com', name: 'Bob' },
];

const mockBook: BudgetBook = {
  id: 'book-1',
  name: 'Old Book Name',
  description: 'Old description',
  participants: ['2'],
  archived: false,
  ownerId: '1',
  createdAt: Timestamp.fromDate(new Date())
};

describe('EditBudgetBookForm', () => {
  beforeEach(() => {
    (getUserId as jest.Mock).mockResolvedValue(mockUser.id);
    (listenToUsers as jest.Mock).mockImplementation((listener: (users: User[]) => void) => {
      listener([mockUser, ...mockOtherUsers]);
      return jest.fn();
    });
  });

  test('renders form with default values', async () => {
    render(<EditBudgetBookForm book={mockBook} />);
    
    expect(await screen.findByLabelText("Naam")).toHaveValue(mockBook.name);
    expect(screen.getByLabelText("Beschrijving")).toHaveValue(mockBook.description);
    expect(screen.getByRole('button', { name: "Opslaan" })).toBeInTheDocument();
  });

  test('submits data', async () => {
    const updateBudgetBookMock = updateBudgetBook as jest.Mock;
    render(<EditBudgetBookForm book={mockBook} />);

    const nameInput = await screen.findByLabelText("Naam");
    const descriptionInput = screen.getByLabelText("Beschrijving");
    const submitButton = screen.getByRole('button', { name: "Opslaan" });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Updated Name');
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, 'Updated description');

    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(updateBudgetBookMock).toHaveBeenCalledTimes(1);
    });

    const [calledId, formData] = updateBudgetBookMock.mock.calls[0];
    expect(calledId).toBe(mockBook.id);
    expect(formData.get('name')).toBe('Updated Name');
    expect(formData.get('description')).toBe('Updated description');
    expect(formData.getAll('participantIds')).toContain('2');
  });

  test('shows error message on submission failure', async () => {
    (updateBudgetBook as jest.Mock).mockRejectedValueOnce(new Error('Failed to update'));

    render(<EditBudgetBookForm book={mockBook} />);

    await userEvent.click(screen.getByRole('button', { name: "Opslaan" }));

    expect(await screen.findByText("Failed to update")).toBeInTheDocument();
  });

  test('shows default error message when error has no message', async () => {
  (updateBudgetBook as jest.Mock).mockRejectedValueOnce({});

  render(<EditBudgetBookForm book={mockBook} />);

  await userEvent.click(screen.getByRole('button', { name: "Opslaan" }));

  expect(await screen.findByText('Er ging iets mis.')).toBeInTheDocument();
});
});
