import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '@/app/dashboard/page';
import { useDashboardData } from '@/app/lib/hooks/useDashboardData';

jest.mock('@/app/lib/hooks/useDashboardData');

class mockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = mockResizeObserver;

describe('DashboardPage', () => {
  test('renders budget books and allows searching', async () => {
    (useDashboardData as jest.Mock).mockReturnValue({
      userId: 'user1',
      budgetBooks: [
        { id: 'b1', name: 'Groceries', ownerId: 'user1' },
        { id: 'b2', name: 'Utilities', ownerId: 'user1' }
      ],
      selectedBook: null,
      setSelectedBook: jest.fn(),
      transactions: [],
      categories: [],
      selectedMonth: '2025-08',
      setSelectedMonth: jest.fn()
    });

    await act(async () => {
      render(<DashboardPage />);
    });

    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Utilities')).toBeInTheDocument();

    await userEvent.type(
      screen.getByPlaceholderText("Zoek in huishoudboekjes..."),
      'gro'
    );

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.queryByText('Utilities')).not.toBeInTheDocument();
    });
  });

test('shows add transaction and add category buttons when a book is selected', () => {
    (useDashboardData as jest.Mock).mockReturnValue({
      userId: 'user1',
      budgetBooks: [{ id: 'b1', name: 'Groceries', ownerId: 'user1' }],
      selectedBook: { id: 'b1', name: 'Groceries', ownerId: 'user1' },
      setSelectedBook: jest.fn(),
      transactions: [],
      categories: [],
      selectedMonth: '2025-08',
      setSelectedMonth: jest.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByText("Transactie toevoegen")).toBeInTheDocument();
    expect(screen.getByText("Categorie toevoegen")).toBeInTheDocument();
  });

test('sorts transactions by date when rendering', () => {
  const transactions = [
    { id: 't1', amount: 100, date: new Date('2025-08-01'), type: 'expense', categoryId: 'c1' },
    { id: 't2', amount: 50, date: new Date('2025-08-05'), type: 'expense', categoryId: 'c1' },
  ];

  (useDashboardData as jest.Mock).mockReturnValue({
    userId: 'user1',
    budgetBooks: [{ id: 'b1', name: 'Groceries', ownerId: 'user1' }],
    selectedBook: { id: 'b1', name: 'Groceries', ownerId: 'user1' },
    setSelectedBook: jest.fn(),
    transactions,
    categories: [],
    selectedMonth: '2025-08',
    setSelectedMonth: jest.fn(),
  });

  render(<DashboardPage />);

const renderedDates = screen.getAllByText(/\d{1,2}[-/]\d{1,2}[-/]\d{4}/);
expect(renderedDates[0]).toHaveTextContent("1-8-2025");
});


});
