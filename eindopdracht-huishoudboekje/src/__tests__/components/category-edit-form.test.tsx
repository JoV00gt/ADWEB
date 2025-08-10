import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { updateCategory } from '@/app/lib/actions/category-actions';
import { validateName, validateBudget } from '@/app/lib/utils/validation-rules';
import { useRouter } from 'next/navigation';
import EditCategoryForm from '@/app/components/category/category-edit-form';

jest.mock('@/app/lib/actions/category-actions', () => ({
  updateCategory: jest.fn(),
}));

jest.mock('@/app/lib/utils/validation-rules', () => ({
  validateName: jest.fn(),
  validateBudget: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/app/components/error', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) =>
    message ? <div>{message}</div> : null,
}));

describe('EditCategoryForm', () => {
  const mockPush = jest.fn();
  const mockBudgetBookId = 'book123';
  const mockCategory = {
    id: 'cat1',
    name: 'Food',
    budget: 200,
    endDate: '2025-08-15T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test('renders with category data', () => {
    render(<EditCategoryForm category={mockCategory} budgetBookId={mockBudgetBookId} />);

    expect(screen.getByLabelText("Naam")).toHaveValue('Food');
    expect(screen.getByLabelText("Budget limiet (€)")).toHaveValue(200);
    expect(screen.getByLabelText("Einddatum (optioneel)")).toHaveValue('2025-08-15');
  });

  test('updates fields when user types', async () => {
    render(<EditCategoryForm category={mockCategory} budgetBookId={mockBudgetBookId} />);

    await userEvent.clear(screen.getByLabelText("Naam"));
    await userEvent.type(screen.getByLabelText("Naam"), 'Groceries');
    await userEvent.clear(screen.getByLabelText("Budget limiet (€)"));
    await userEvent.type(screen.getByLabelText("Budget limiet (€)"), '150');
    await userEvent.clear(screen.getByLabelText("Einddatum (optioneel)"));
    await userEvent.type(screen.getByLabelText("Einddatum (optioneel)"), '2025-09-01');

    expect(screen.getByLabelText("Naam")).toHaveValue('Groceries');
    expect(screen.getByLabelText("Budget limiet (€)")).toHaveValue(150);
    expect(screen.getByLabelText("Einddatum (optioneel)")).toHaveValue('2025-09-01');
  });

  test('calls updateCategory and navigates on success', async () => {
    (updateCategory as jest.Mock).mockResolvedValueOnce(undefined);

    render(<EditCategoryForm category={mockCategory} budgetBookId={mockBudgetBookId} />);

    await userEvent.click(screen.getByRole('button', { name: "Opslaan" }));

    await waitFor(() => {
      expect(validateName).toHaveBeenCalledWith('Food');
      expect(validateBudget).toHaveBeenCalledWith('200');
      expect(updateCategory).toHaveBeenCalledWith(mockBudgetBookId, mockCategory.id, {
        name: 'Food',
        budget: 200,
        endDate: new Date('2025-08-15'),
      });
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('displays error if validation fails', async () => {
    (validateName as jest.Mock).mockImplementation(() => {
      throw new Error('Name is invalid');
    });

    render(<EditCategoryForm category={mockCategory} budgetBookId={mockBudgetBookId} />);

    await userEvent.click(screen.getByRole('button', { name: "Opslaan" }));

    await waitFor(() => {
      expect(screen.getByText('Name is invalid')).toBeInTheDocument();
      expect(updateCategory).not.toHaveBeenCalled();
    });
  });

  test('displays error if updateCategory throws', async () => {
  (validateName as jest.Mock).mockImplementation(() => {});
  (validateBudget as jest.Mock).mockImplementation(() => {});
  (updateCategory as jest.Mock).mockRejectedValueOnce(new Error('Update failed'));

  render(<EditCategoryForm category={mockCategory} budgetBookId={mockBudgetBookId} />);

  await userEvent.click(screen.getByRole('button', { name: "Opslaan" }));

  await waitFor(() => {
    expect(screen.getByText('Update failed')).toBeInTheDocument();
  });
  });

  test('initializes with empty endDate if category has no endDate', () => {
  const categoryWithoutEndDate = {
    ...mockCategory,
    endDate: null,
  };
  render(<EditCategoryForm category={categoryWithoutEndDate} budgetBookId={mockBudgetBookId} />);
  expect(screen.getByLabelText("Einddatum (optioneel)")).toHaveValue('');
});

test('shows default error message when no error is provided', async () => {
  (validateName as jest.Mock).mockImplementation(() => {});
  (validateBudget as jest.Mock).mockImplementation(() => {});
  (updateCategory as jest.Mock).mockRejectedValueOnce({});

  render(<EditCategoryForm category={mockCategory} budgetBookId={mockBudgetBookId} />);

  await userEvent.click(screen.getByRole('button', { name: "Opslaan" }));

  expect(await screen.findByText("Er ging iets mis bij het opslaan.")).toBeInTheDocument();
});

});
