import { Pagination } from '@/app/components/pagination';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('renders pagination info and buttons correctly', () => {
  const onPageChange = jest.fn();
  render(<Pagination currentPage={2} totalPages={5} onPageChange={onPageChange} />);

  expect(screen.getByText('Pagina 2 van 5')).toBeInTheDocument();

  const prevButton = screen.getByRole('button', { name: 'Vorige' });
  const nextButton = screen.getByRole('button', { name: 'Volgende' });

  expect(prevButton).toBeEnabled();
  expect(nextButton).toBeEnabled();
});

test('disables previous button on first page', () => {
  const onPageChange = jest.fn();
  render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

  const prevButton = screen.getByRole('button', { name: 'Vorige' });
  expect(prevButton).toBeDisabled();
});

test('disables next button on last page', () => {
  const onPageChange = jest.fn();
  render(<Pagination currentPage={5} totalPages={5} onPageChange={onPageChange} />);

  const nextButton = screen.getByRole('button', { name: 'Volgende' });
  expect(nextButton).toBeDisabled();
});

test('calls onPageChange with correct page on prev/next clicks', async () => {
  const onPageChange = jest.fn();
  render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

  const prevButton = screen.getByRole('button', { name: 'Vorige' });
  const nextButton = screen.getByRole('button', { name: 'Volgende' });

  await userEvent.click(prevButton);
  expect(onPageChange).toHaveBeenCalledWith(2);

  await userEvent.click(nextButton);
  expect(onPageChange).toHaveBeenCalledWith(4);
});
