import { render, screen } from '@testing-library/react';
import type { Transaction } from '@/app/lib/definitions';
import { TransactionStats } from '@/app/components/transactions/transaction-stats';

describe('TransactionStats', () => {
  const mockTransactions: Transaction[] = [
    { id: '1', amount: 100, type: 'inkomen', date: new Date('2025-01-01'), categoryId: 'cat1' },
    { id: '2', amount: 50, type: 'uitgave', date: new Date('2025-01-02'), categoryId: 'cat2' },
    { id: '3', amount: 200, type: 'inkomen', date: new Date('2025-01-03'), categoryId: 'cat1' },
    { id: '4', amount: 75, type: 'uitgave', date: new Date('2025-01-04'), categoryId: 'cat3' },
  ];

  test('renders total income and total expenses correctly', () => {
    render(<TransactionStats transactions={mockTransactions} />);

    //total income: 100 + 200 = 300
    expect(screen.getByText("Totale inkomsten")).toBeInTheDocument();
    expect(screen.getByText('€ 300.00')).toBeInTheDocument();

    //total expenses: 50 + 75 = 125
    expect(screen.getByText("Totale uitgaven")).toBeInTheDocument();
    expect(screen.getByText('€ 125.00')).toBeInTheDocument();
  });

  test('renders zero totals when no transactions', () => {
    render(<TransactionStats transactions={[]} />);

    const incomeContainer = screen.getByText("Totale inkomsten").parentElement;
    expect(incomeContainer).toHaveTextContent('€ 0.00');

    const expensesContainer = screen.getByText("Totale uitgaven").parentElement;
    expect(expensesContainer).toHaveTextContent('€ 0.00');
  });
});
