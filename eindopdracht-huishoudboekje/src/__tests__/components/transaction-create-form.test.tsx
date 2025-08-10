import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as transactionsActions from '@/app/lib/actions/transactions-actions';
import * as categoryListener from '@/app/lib/listeners/category-listener';
import * as validationRules from '@/app/lib/utils/validation-rules';
import { useRouter } from 'next/navigation';
import TransactionForm from '@/app/components/transactions/transaction-create-form';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/app/lib/actions/transactions-actions');
jest.mock('@/app/lib/listeners/category-listener');
jest.mock('@/app/lib/utils/validation-rules');

describe('TransactionForm', () => {
  const mockBudgetBookId = 'book1';

  beforeEach(() => {
    jest.clearAllMocks();

    (categoryListener.listenCategories as jest.Mock).mockImplementation((setCategories) => {
      setCategories([
        { id: 'cat1', name: 'Food' },
        { id: 'cat2', name: 'Transport' },
      ]);
      return jest.fn();
    });

    (validationRules.validateTransactions as jest.Mock).mockReturnValue(null);

    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    (transactionsActions.addTransactions as jest.Mock).mockResolvedValue(undefined);
  });

  test('renders initial form correctly', () => {
    const { container } = render(<TransactionForm budgetBookId={mockBudgetBookId} />);
    expect(screen.getByText("Transacties toevoegen")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Voeg transactie toe" })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Opslaan" })).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Bedrag")).toBeInTheDocument();
    const selects = container.querySelectorAll('select');
    expect(selects.length).toBeGreaterThanOrEqual(2);
  });

  test('adds a new transaction row when clicking add button', async () => {
    render(<TransactionForm budgetBookId={mockBudgetBookId} />);
    const addButton = screen.getByRole('button', { name: "Voeg transactie toe" });

    await userEvent.click(addButton);
    expect(screen.getAllByPlaceholderText("Bedrag")).toHaveLength(2);
  });

  test('shows error when adding more than 10 rows', async () => {
    render(<TransactionForm budgetBookId={mockBudgetBookId} />);
    const addButton = screen.getByRole('button', { name: "Voeg transactie toe" });

    for (let i = 1; i < 10; i++) {
      await userEvent.click(addButton);
    }
    expect(screen.getAllByPlaceholderText("Bedrag")).toHaveLength(10);
    await userEvent.click(addButton);
    expect(screen.getByText("Maximaal 10 transacties toegestaan")).toBeInTheDocument();
  });

  test('handles input changes correctly', async () => {
    const { container } = render(<TransactionForm budgetBookId={mockBudgetBookId} />);

    const amountInput = screen.getByPlaceholderText("Bedrag");
    await userEvent.clear(amountInput);
    await userEvent.type(amountInput, '123.45');
    expect(amountInput).toHaveValue(123.45);

    const selects = container.querySelectorAll('select');
    const typeSelect = selects[0];
    const categorySelect = selects[1];

    await userEvent.selectOptions(typeSelect, 'inkomen');
    expect(typeSelect).toHaveValue('inkomen');

    await userEvent.selectOptions(categorySelect, 'cat2');
    expect(categorySelect).toHaveValue('cat2');
  });

  test('deletes a transaction row', async () => {
    render(<TransactionForm budgetBookId={mockBudgetBookId} />);
    const addButton = screen.getByRole('button', { name: "Voeg transactie toe" });

    await userEvent.click(addButton);
    expect(screen.getAllByPlaceholderText("Bedrag")).toHaveLength(2);

    const deleteButtons = screen.getAllByRole('button', { name: "X" });
    expect(deleteButtons).toHaveLength(2);

    await userEvent.click(deleteButtons[0]);
    expect(screen.getAllByPlaceholderText("Bedrag")).toHaveLength(1);
  });

  test('submits transactions successfully and redirects', async () => {
    const router = useRouter();
    const push = router.push;
    render(<TransactionForm budgetBookId={mockBudgetBookId} />);

    const saveButton = screen.getByRole('button', { name: "Opslaan" });
    await userEvent.click(saveButton);

    await waitFor(() => {
      expect(transactionsActions.addTransactions).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows validation error on submit', async () => {
    (validationRules.validateTransactions as jest.Mock).mockReturnValue('Foutieve invoer');

    render(<TransactionForm budgetBookId={mockBudgetBookId} />);

    const saveButton = screen.getByRole('button', { name: "Opslaan" });
    await userEvent.click(saveButton);

    expect(await screen.findByText('Foutieve invoer')).toBeInTheDocument();
    expect(transactionsActions.addTransactions).not.toHaveBeenCalled();
  });

  test('shows error message when submission fails', async () => {
    (transactionsActions.addTransactions as jest.Mock).mockRejectedValue(new Error('Server error'));

    render(<TransactionForm budgetBookId={mockBudgetBookId} />);

    const saveButton = screen.getByRole('button', { name: "Opslaan" });
    await userEvent.click(saveButton);

    expect(await screen.findByText("Server error")).toBeInTheDocument();
  });
});
