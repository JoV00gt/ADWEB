import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addCategory } from '@/app/lib/actions/category-actions';
import { useRouter } from 'next/navigation';
import CategoryForm from '@/app/components/category/category-create-form';

jest.mock('@/app/lib/actions/category-actions', () => ({
  addCategory: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/app/components/error', () => ({
  __esModule: true,
  default: ({ message }: { message: string }) =>
    message ? <div>{message}</div> : null,
}));

describe('CategoryForm', () => {
  const mockPush = jest.fn();
  const mockBudgetBookId = 'book123';

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test('renders all input fields', () => {
    render(<CategoryForm budgetBookId={mockBudgetBookId} />);

    expect(screen.getByLabelText("Naam *")).toBeInTheDocument();
    expect(screen.getByLabelText("Maximaal budget *")).toBeInTheDocument();
    expect(screen.getByLabelText("Einddatum (optioneel)")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Opslaan" })).toBeInTheDocument();
  });

  test('updates state when inputs change', async () => {
    render(<CategoryForm budgetBookId={mockBudgetBookId} />);

    await userEvent.type(screen.getByLabelText("Naam *"), 'Groceries');
    await userEvent.type(screen.getByLabelText("Maximaal budget *"), '200');
    await userEvent.type(screen.getByLabelText("Einddatum (optioneel)"), '2025-08-10');

    expect(screen.getByLabelText("Naam *")).toHaveValue('Groceries');
    expect(screen.getByLabelText("Maximaal budget *")).toHaveValue(200);
    expect(screen.getByLabelText("Einddatum (optioneel)")).toHaveValue('2025-08-10');
  });

  test('calls addCategory and navigates on success', async () => {
    (addCategory as jest.Mock).mockResolvedValueOnce(undefined);

    render(<CategoryForm budgetBookId={mockBudgetBookId} />);

    await userEvent.type(screen.getByLabelText("Naam *"), 'Groceries');
    await userEvent.type(screen.getByLabelText("Maximaal budget *"), '150');
    await userEvent.type(screen.getByLabelText("Einddatum (optioneel)"), '2025-08-20');

    await userEvent.click(screen.getByRole('button', { name: "Opslaan" }));

    await waitFor(() => {
      expect(addCategory).toHaveBeenCalledWith(mockBudgetBookId, 'Groceries', 150, '2025-08-20');
      expect(mockPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('displays error when addCategory fails', async () => {
    (addCategory as jest.Mock).mockRejectedValueOnce(new Error('Failed to add'));

    render(<CategoryForm budgetBookId={mockBudgetBookId} />);

    await userEvent.type(screen.getByLabelText("Naam *"), 'Groceries');
    await userEvent.type(screen.getByLabelText("Maximaal budget *"), '150');

    await userEvent.click(screen.getByRole('button', { name: "Opslaan" }));

    await waitFor(() => {
      expect(screen.getByText('Failed to add')).toBeInTheDocument();
    });
  });
});
