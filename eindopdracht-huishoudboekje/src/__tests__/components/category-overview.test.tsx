import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { deleteCategory } from '@/app/lib/actions/category-actions';
import { calculateCategoryUsage } from '@/app/lib/utils/category-utils';
import type { Category, Transaction } from '@/app/lib/definitions';
import { CategoryOverview } from '@/app/components/category/category-overview';

jest.mock('@/app/lib/actions/category-actions', () => ({
  deleteCategory: jest.fn(),
}));

jest.mock('@/app/lib/utils/category-utils', () => ({
  calculateCategoryUsage: jest.fn(),
}));

jest.mock('@/app/components/confirm-delete-modal', () => ({
  ConfirmDeleteModal: ({ isOpen, onCancel, onConfirm }: any) =>
    isOpen ? (
      <div data-testid="confirm-delete-modal">
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null,
}));

describe('CategoryOverview', () => {
  const mockBudgetBookId = 'book1';
  const mockBaseCategory: Category = {
    budgetBookId: "book1",
    id: 'cat1',
    name: 'Groceries',
    budget: 100,
    endDate: undefined,
  };
  const mockTransactions: Transaction[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
    (calculateCategoryUsage as jest.Mock).mockReturnValue({
      available: 50,
      percentageUsed: 50,
      isOver: false,
      isWarning: false,
    });
  });

  test('renders no categories found', () => {
    render(
      <CategoryOverview
        categories={[]}
        transactions={mockTransactions}
        budgetBookId={mockBudgetBookId}
        currentUser="user1"
        ownerId="user1"
      />
    );

    expect(screen.getByText("Geen categorieën gevonden.")).toBeInTheDocument();
  });

  test('renders category list with data', () => {
    render(
      <CategoryOverview
        categories={[mockBaseCategory]}
        transactions={mockTransactions}
        budgetBookId={mockBudgetBookId}
        currentUser="user1"
        ownerId="user1"
      />
    );

    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("€50.00 beschikbaar")).toBeInTheDocument();
  });

  test('does not show edit/delete buttons if user is not owner', () => {
    render(
      <CategoryOverview
        categories={[mockBaseCategory]}
        transactions={mockTransactions}
        budgetBookId={mockBudgetBookId}
        currentUser="user2"
        ownerId="user1"
      />
    );

    expect(screen.queryByText("Bewerken")).not.toBeInTheDocument();
    expect(screen.queryByText("Verwijderen")).not.toBeInTheDocument();
  });

  test('deletes category successfully', async () => {
    (deleteCategory as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <CategoryOverview
        categories={[mockBaseCategory]}
        transactions={mockTransactions}
        budgetBookId={mockBudgetBookId}
        currentUser="user1"
        ownerId="user1"
      />
    );

    await userEvent.click(screen.getByText("Verwijderen"));
    await userEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(deleteCategory).toHaveBeenCalledWith(mockBudgetBookId, mockBaseCategory.id);
    });

    expect(screen.queryByText("Confirm Delete Modal")).not.toBeInTheDocument();
  });

  test('shows error if deleteCategory fails', async () => {
    (deleteCategory as jest.Mock).mockRejectedValueOnce(new Error('Boom'));

    render(
      <CategoryOverview
        categories={[mockBaseCategory]}
        transactions={mockTransactions}
        budgetBookId={mockBudgetBookId}
        currentUser="user1"
        ownerId="user1"
      />
    );

    await userEvent.click(screen.getByText("Verwijderen"));
    await userEvent.click(screen.getByText("Confirm"));

    await waitFor(() => {
      expect(screen.getByText("Fout bij het verwijderen")).toBeInTheDocument();
    });
  });

test('closes delete modal when cancel is clicked', async () => {
  render(
    <CategoryOverview
      categories={[mockBaseCategory]}
      transactions={mockTransactions}
      budgetBookId={mockBudgetBookId}
      currentUser="user1"
      ownerId="user1"
    />
  );

  await userEvent.click(screen.getByText("Verwijderen"));
  await userEvent.click(screen.getByText("Cancel"));
  expect(screen.queryByTestId('confirm-delete-modal')).not.toBeInTheDocument();
});

});
