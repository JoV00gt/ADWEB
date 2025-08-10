import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteTransaction } from '@/app/lib/actions/transactions-actions';
import type { Transaction } from '@/app/lib/definitions';
import { TransactionList } from '@/app/components/transactions/transaction.list';

jest.mock('@/app/lib/actions/transactions-actions', () => ({
  deleteTransaction: jest.fn(),
}));

const mockTransactions: Transaction[] = [
  {
    id: 't1',
    amount: 50,
    type: 'inkomen',
    date: new Date('2025-01-01'),
    categoryId: 'c1',
  },
  {
    id: 't2',
    amount: 20,
    type: 'uitgave',
    date: new Date('2025-02-01'),
    categoryId: 'c2',
  },
];

const mockCategories = [
  { id: 'c1', name: 'Salaris' },
  { id: 'c2', name: 'Boodschappen' },
];

const mockDefaultProps = {
  budgetBookId: 'book1',
  currentUser: 'owner123',
  ownerId: 'owner123',
  categories: mockCategories,
};

describe('TransactionList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders transactions with correct category and amount', () => {
    render(
      <TransactionList
        {...mockDefaultProps}
        transactions={mockTransactions}
      />
    );

    mockTransactions.forEach((tx) => {
      expect(screen.getByText(tx.date.toLocaleDateString())).toBeInTheDocument();
      expect(screen.getByText(tx.type)).toBeInTheDocument();
      const categoryName =
        mockCategories.find((c) => c.id === tx.categoryId)?.name || 'Geen categorie';
      expect(screen.getByText(categoryName)).toBeInTheDocument();
      expect(
        screen.getByText(`€ ${Number(tx.amount).toFixed(2)}`)
      ).toBeInTheDocument();
    });
  });

  test('shows edit and delete buttons only if current user is also the owner', () => {
    const { rerender } = render(
      <TransactionList
        {...mockDefaultProps}
        transactions={mockTransactions}
      />
    );
    expect(screen.getAllByRole('link', { name: "Bewerken" })).toHaveLength(
      mockTransactions.length
    );
    expect(
      screen.getAllByRole('button', { name: "Verwijderen" })
    ).toHaveLength(mockTransactions.length);

    rerender(
      <TransactionList
        {...mockDefaultProps}
        currentUser="someoneElse"
        transactions={mockTransactions}
      />
    );
    expect(
      screen.queryByRole('link', { name: "Bewerken" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: "Verwijderen" })
    ).not.toBeInTheDocument();
  });

  test('opens delete modal and confirms deletion', async () => {
    (deleteTransaction as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <TransactionList
        {...mockDefaultProps}
        transactions={[mockTransactions[0]]}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: "Verwijderen" }));
    expect(
      screen.getByText(/Transactie verwijderen\?/i)
    ).toBeInTheDocument();

    const confirmButton = document.querySelector('button[data-testid="confirm-delete"]') as HTMLButtonElement;
    if (!confirmButton) throw new Error('Confirm button not found');

    await userEvent.click(confirmButton);
    expect(deleteTransaction).toHaveBeenCalledWith(
      mockDefaultProps.budgetBookId,
      mockTransactions[0].id
    );
  });

  test('shows error message when deletion fails', async () => {
    (deleteTransaction as jest.Mock).mockRejectedValueOnce(new Error('Fail'));

    render(
      <TransactionList
        {...mockDefaultProps}
        transactions={[mockTransactions[0]]}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: "Verwijderen" }));

    const confirmButton = document.querySelector('button[data-testid="confirm-delete"]') as HTMLButtonElement;
    if (!confirmButton) throw new Error('Confirm button not found');

    await userEvent.click(confirmButton);

    expect(
      await screen.findByText("Fout bij het verwijderen")
    ).toBeInTheDocument();
  });

  test('paginates shown transactions when there are more than 8', () => {
    const manyTransactions: Transaction[] = Array.from({ length: 10 }, (_, i) => ({
      ...mockTransactions[0],
      id: `t${i}`,
      amount: i,
    }));

    render(
      <TransactionList
        {...mockDefaultProps}
        transactions={manyTransactions}
      />
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(8);
    expect(screen.getByRole('button', { name: 'Vorige' }));
    expect(screen.getByRole('button', { name: 'Volgende' }));
  });

test('closes modal when cancel is clicked', async () => {
  render(
    <TransactionList
      {...mockDefaultProps}
      transactions={[mockTransactions[0]]}
    />
  );

  await userEvent.click(screen.getByRole('button', { name: "Verwijderen" }));
  expect(screen.getByText(/Transactie verwijderen\?/i)).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: "Annuleren" }));
  expect(screen.queryByText(/Transactie verwijderen\?/i)).not.toBeInTheDocument();
});

});
