import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '@/app/dashboard/page';
import { useUser } from '@/app/lib/hooks/useUser';
import { useBudgetBooks } from '@/app/lib/hooks/useBudgetBooks';
import { useSelectedBook } from '@/app/lib/hooks/useSelectedBook';
import { useSelectedMonth } from '@/app/lib/hooks/useSelectedMonth';
import { useTransactions } from '@/app/lib/hooks/useTransactions';
import { useCategories } from '@/app/lib/hooks/useCategories';

jest.mock('@/app/lib/hooks/useUser', () => ({
  useUser: jest.fn(),
}));
jest.mock('@/app/lib/hooks/useBudgetBooks', () => ({
  useBudgetBooks: jest.fn(),
}));
jest.mock('@/app/lib/hooks/useSelectedBook', () => ({
  useSelectedBook: jest.fn(),
}));
jest.mock('@/app/lib/hooks/useSelectedMonth', () => ({
  useSelectedMonth: jest.fn(),
}));
jest.mock('@/app/lib/hooks/useTransactions', () => ({
  useTransactions: jest.fn(),
}));
jest.mock('@/app/lib/hooks/useCategories', () => ({
  useCategories: jest.fn(),
}));

class mockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = mockResizeObserver;

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useUser as jest.Mock).mockReturnValue('user1');
    (useSelectedMonth as jest.Mock).mockReturnValue({
      selectedMonth: '2025-08',
      setSelectedMonth: jest.fn(),
    });
    (useCategories as jest.Mock).mockReturnValue([]);
  });

  test('renders budget books and allows searching', async () => {
    (useBudgetBooks as jest.Mock).mockReturnValue([
      { id: 'b1', name: 'Groceries', ownerId: 'user1' },
      { id: 'b2', name: 'Utilities', ownerId: 'user1' },
    ]);
    (useSelectedBook as jest.Mock).mockReturnValue({
      selectedBook: null,
      setSelectedBook: jest.fn(),
    });
    (useTransactions as jest.Mock).mockReturnValue([]);

    render(<DashboardPage />);

    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Utilities')).toBeInTheDocument();

    await userEvent.type(
      screen.getByPlaceholderText('Zoek in huishoudboekjes...'),
      'gro'
    );

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.queryByText('Utilities')).not.toBeInTheDocument();
    });
  });

  test('shows add transaction and add category buttons when a book is selected', () => {
    (useBudgetBooks as jest.Mock).mockReturnValue([
      { id: 'b1', name: 'Groceries', ownerId: 'user1' },
    ]);
    (useSelectedBook as jest.Mock).mockReturnValue({
      selectedBook: { id: 'b1', name: 'Groceries', ownerId: 'user1' },
      setSelectedBook: jest.fn(),
    });
    (useTransactions as jest.Mock).mockReturnValue([]);

    render(<DashboardPage />);

    expect(screen.getByText('Transactie toevoegen')).toBeInTheDocument();
    expect(screen.getByText('Categorie toevoegen')).toBeInTheDocument();
  });

  test('sorts transactions by date when rendering', () => {
    const transactions = [
      {
        id: 't1',
        amount: 100,
        date: new Date('2025-08-01'),
        type: 'expense',
        categoryId: 'c1',
      },
      {
        id: 't2',
        amount: 50,
        date: new Date('2025-08-05'),
        type: 'expense',
        categoryId: 'c1',
      },
    ];

    (useBudgetBooks as jest.Mock).mockReturnValue([
      { id: 'b1', name: 'Groceries', ownerId: 'user1' },
    ]);
    (useSelectedBook as jest.Mock).mockReturnValue({
      selectedBook: { id: 'b1', name: 'Groceries', ownerId: 'user1' },
      setSelectedBook: jest.fn(),
    });
    (useTransactions as jest.Mock).mockReturnValue(transactions);

    render(<DashboardPage />);

    const renderedDates = screen.getAllByText(/\d{1,2}-\d{1,2}-\d{4}/);
    expect(renderedDates[0]).toHaveTextContent('1-8-2025');
  });
});
