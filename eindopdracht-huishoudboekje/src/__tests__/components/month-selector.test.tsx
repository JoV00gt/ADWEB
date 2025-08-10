import { MonthSelector } from '@/app/components/month-selector';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('renders all months as options', () => {
  const onChange = jest.fn();
  render(<MonthSelector selectedMonth={0} onChange={onChange} />);
  
  const options = screen.getAllByRole('option');
  expect(options).toHaveLength(12);
  
  expect(options[0]).toHaveTextContent('Januari');
  expect(options[11]).toHaveTextContent('December');
});

test('selectedMonth controls selected option', () => {
  const onChange = jest.fn();
  render(<MonthSelector selectedMonth={4} onChange={onChange} />);
  
  const select = screen.getByRole('combobox');
  expect(select).toHaveValue('4');
});

test('calls onChange with correct month number on selection change', async () => {
  const onChange = jest.fn();
  render(<MonthSelector selectedMonth={0} onChange={onChange} />);
  
  const select = screen.getByRole('combobox');
  
  await userEvent.selectOptions(select, '7');
  
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(7);
});
