import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ArchivePage from '@/app/archive/page';
import { useArchivedBudgetBooks } from '@/app/lib/hooks/useArchivedBooks';

jest.mock('@/app/lib/hooks/useArchivedBooks');

const mockUseArchivedBudgetBooks = useArchivedBudgetBooks as jest.Mock;

describe('ArchivePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows spinner while loading', () => {
    mockUseArchivedBudgetBooks.mockReturnValue({
      budgetBooks: [],
      userId: 'u1',
      loading: true,
    });

    render(<ArchivePage />);
    expect(screen.getByLabelText("loading")).toBeInTheDocument();
  });

  test('renders budget books and paginate', async () => {
    const books = Array.from({ length: 8 }, (_, i) => ({
      id: `b${i}`,
      name: `Book ${i}`,
      ownerId: 'u1',
      isArchived: true,
    }));

    mockUseArchivedBudgetBooks.mockReturnValue({
      budgetBooks: books,
      userId: 'u1',
      loading: false,
    });

    render(<ArchivePage />);

    books.slice(0, 5).forEach((b) => {
      expect(screen.getByText(b.name)).toBeInTheDocument();
    });
    books.slice(5).forEach((b) => {
      expect(screen.queryByText(b.name)).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: "Volgende" }));
    books.slice(5).forEach((b) => {
      expect(screen.getByText(b.name)).toBeInTheDocument();
    });
  });

  test('filters budget books by search query', async () => {
    const mockBooks = [
      { id: '1', name: 'Groceries', ownerId: 'u1', isArchived: true },
      { id: '2', name: 'Utilities', ownerId: 'u1', isArchived: true },
    ];

    mockUseArchivedBudgetBooks.mockReturnValue({
      budgetBooks: mockBooks,
      userId: 'u1',
      loading: false,
    });

    render(<ArchivePage />);

    await userEvent.type(screen.getByPlaceholderText("Zoek in archief..."), 'gro');
    await waitFor(() => {
        expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.queryByText('Utilities')).not.toBeInTheDocument();
    });
  });
});
