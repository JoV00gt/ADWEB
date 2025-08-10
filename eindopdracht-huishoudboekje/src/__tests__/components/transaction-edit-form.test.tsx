import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { updateTransaction } from '@/app/lib/actions/transactions-actions';
import { listenCategories } from '@/app/lib/listeners/category-listener';
import { validateTransactions } from '@/app/lib/utils/validation-rules';
import { useRouter } from 'next/navigation';
import EditTransactionForm from '@/app/components/transactions/transaction-edit-form';

jest.mock('@/app/lib/actions/transactions-actions');
jest.mock('@/app/lib/listeners/category-listener');
jest.mock('@/app/lib/utils/validation-rules');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('EditTransactionForm', () => {
  const mockBudgetBookId = 'book1';
  const mockTransaction = {
    id: 'tx1',
    amount: 100,
    type: 'uitgave',
    date: '2023-01-01',
    categoryId: 'cat1',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (listenCategories as jest.Mock).mockImplementation((setCategories) => {
      setCategories([
        { id: 'cat1', name: 'Food' },
        { id: 'cat2', name: 'Transport' },
      ]);
      return jest.fn();
    });

    (validateTransactions as jest.Mock).mockReturnValue(null);

    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    (updateTransaction as jest.Mock).mockResolvedValue(undefined);
  });

  test('renders form with initial values and categories', async () => {
    render(<EditTransactionForm budgetBookId={mockBudgetBookId} transaction={mockTransaction} />);

    const amountInput = await screen.findByPlaceholderText(/bedrag/i);
    expect(amountInput).toHaveValue(mockTransaction.amount);

    const selects = screen.getAllByRole('combobox');
    const typeSelect = selects[0];
    const categorySelect = selects[1];

    expect(typeSelect).toHaveValue(mockTransaction.type);
    expect(categorySelect).toHaveValue(mockTransaction.categoryId);
  });

  test('updates input fields on user interaction', async () => {
    render(<EditTransactionForm budgetBookId={mockBudgetBookId} transaction={mockTransaction} />);

    const amountInput = await screen.findByPlaceholderText("Bedrag");
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '123.45');
    expect(amountInput).toHaveValue(123.45);

    const typeSelect = screen.getAllByRole('combobox')[0];
    await userEvent.selectOptions(typeSelect, 'inkomen');
    expect(typeSelect).toHaveValue('inkomen');

    const categorySelect = screen.getAllByRole('combobox')[1];
    await userEvent.selectOptions(categorySelect, 'cat2');
    expect(categorySelect).toHaveValue('cat2');
  });

  test('shows validation error if invalid input on submit', async () => {
    (validateTransactions as jest.Mock).mockReturnValue('Foutieve invoer');

    render(<EditTransactionForm budgetBookId={mockBudgetBookId} transaction={mockTransaction} />);

    await userEvent.click(screen.getByRole('button', { name: "Opslaan" }));

    expect(await screen.findByText('Foutieve invoer')).toBeInTheDocument();
    expect(updateTransaction).not.toHaveBeenCalled();
  });

  test('submits successfully and navigates on valid input', async () => {
    const router = useRouter();
    const push = router.push;

    render(<EditTransactionForm budgetBookId={mockBudgetBookId} transaction={mockTransaction} />);

    await userEvent.click(screen.getByRole('button', { name: "Opslaan" }));

    await waitFor(() => {
      expect(updateTransaction).toHaveBeenCalledWith(
        mockBudgetBookId,
        mockTransaction.id,
        expect.objectContaining({
          amount: expect.any(String),
          type: expect.any(String),
          date: expect.any(Date),
          categoryId: expect.any(String),
        }),
      );
      expect(push).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error message when submission fails', async () => {
    (updateTransaction as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

    render(<EditTransactionForm budgetBookId={mockBudgetBookId} transaction={mockTransaction} />);

    await userEvent.click(screen.getByRole('button', { name: "Opslaan" }));

    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });

  test('shows default error message when submission fails without message', async () => {
  (updateTransaction as jest.Mock).mockRejectedValueOnce({});

  render(<EditTransactionForm budgetBookId={mockBudgetBookId} transaction={mockTransaction} />);

  await userEvent.click(screen.getByRole('button', { name: "Opslaan" }));

  expect(await screen.findByText("Er ging iets mis bij opslaan.")).toBeInTheDocument();
  });

  test('initializes with empty categoryId when none is provided', async () => {
  const noCategoryTransaction = {
    ...mockTransaction,
    categoryId: undefined,
  };

  render(<EditTransactionForm budgetBookId={mockBudgetBookId} transaction={noCategoryTransaction} />);

  const categorySelect = await screen.findAllByRole('combobox');
  expect(categorySelect[1]).toHaveValue('');
});

});
