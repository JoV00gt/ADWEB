import TransactionRow from '@/app/components/transactions/transaction-row';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('TransactionRow', () => {
  const mockCategories = [
    { id: 'cat1', name: 'Food' },
    { id: 'cat2', name: 'Transport' },
  ];

  const mockTransaction = {
    amount: '123.45',
    type: 'uitgave',
    date: new Date('2023-08-15'),
    categoryId: 'cat1',
  };

  test('renders all inputs with correct values', () => {
    render(
      <TransactionRow
        index={0}
        transaction={mockTransaction}
        onChange={() => {}}
        onDelete={() => {}}
        canDelete={true}
        categories={mockCategories}
      />
    );

    expect(screen.getByPlaceholderText('Bedrag')).toHaveValue(123.45);

    const selects = screen.getAllByRole('combobox');
    const typeSelect = selects[0] as HTMLSelectElement;
    const categorySelect = selects[1] as HTMLSelectElement;

    expect(typeSelect.value).toBe(mockTransaction.type);
    expect(categorySelect.value).toBe(mockTransaction.categoryId);

    expect(screen.getByDisplayValue('2023-08-15')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: "X" })).toBeInTheDocument();
  });

test('calls onChange when inputs change', async () => {
  const handleChange = jest.fn();

  render(
    <TransactionRow
      index={0}
      transaction={mockTransaction}
      onChange={handleChange}
      onDelete={() => {}}
      canDelete={true}
      categories={mockCategories}
    />
  );

  fireEvent.change(screen.getByPlaceholderText('Bedrag'), { target: { value: '200' } });
  fireEvent.change(screen.getByDisplayValue('2023-08-15'), { target: { value: '2023-09-01' } });

  const selects = screen.getAllByRole('combobox');
  const typeSelect = selects[0];
  const categorySelect = selects[1];

  await userEvent.selectOptions(typeSelect, 'inkomen');
  await userEvent.selectOptions(categorySelect, 'cat2');

  expect(handleChange).toHaveBeenCalledWith(0, 'amount', '200');
  expect(handleChange).toHaveBeenCalledWith(0, 'type', 'inkomen');
  expect(handleChange).toHaveBeenCalledWith(0, 'categoryId', 'cat2');
  expect(handleChange).toHaveBeenCalledWith(0, 'date', '2023-09-01');
});

  test('calls onDelete when delete button is clicked', async () => {
    const handleDelete = jest.fn();

    render(
      <TransactionRow
        index={0}
        transaction={mockTransaction}
        onChange={() => {}}
        onDelete={handleDelete}
        canDelete={true}
        categories={mockCategories}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: "X" }));
    expect(handleDelete).toHaveBeenCalledWith(0);
  });

  test('does not render delete button when canDelete is false', () => {
    render(
      <TransactionRow
        index={0}
        transaction={mockTransaction}
        onChange={() => {}}
        onDelete={() => {}}
        canDelete={false}
        categories={mockCategories}
      />
    );

    expect(screen.queryByRole('button', { name: "X" })).not.toBeInTheDocument();
  });
});
