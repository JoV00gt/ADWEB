import MultiSelect from "@/app/components/select";
import { fireEvent, render, screen } from "@testing-library/react";

const mockOptions = [
  { label: 'User One', value: 'user1' },
  { label: 'User Two', value: 'user2' },
  { label: 'User Three', value: 'user3' },
];

const mockSelectedValues = ['user1', 'user3'];

test('renders label and options', () => {
  render(<MultiSelect options={mockOptions} selectedValues={[]} onChange={() => {}} label="Test Label" />);
  
  expect(screen.getByText('Test Label')).toBeInTheDocument();

  mockOptions.forEach((opt) => {
    expect(screen.getByRole('option', { name: opt.label })).toBeInTheDocument();
  });
});

test('renders selected values and hidden inputs', () => {
  render(<MultiSelect options={mockOptions} selectedValues={mockSelectedValues} onChange={() => {}} name="participants" />);

  mockSelectedValues.forEach((val) => {
    const option = screen.getByRole('option', { name: mockOptions.find(o => o.value === val)!.label }) as HTMLOptionElement;
    expect(option.selected).toBe(true);
  });

  mockSelectedValues.forEach((val) => {
    const hiddenInput = screen.getByDisplayValue(val);
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveAttribute('type', 'hidden');
    expect(hiddenInput).toHaveAttribute('name', 'participants');
  });
});

test('calls onChange when selection changes', () => {
  const onChangeMock = jest.fn();
  render(<MultiSelect options={mockOptions} selectedValues={[]} onChange={onChangeMock} />);

  const select = screen.getByRole('listbox');

  mockOptions.forEach((opt) => {
    const option = screen.getByRole('option', { name: opt.label }) as HTMLOptionElement;
    option.selected = mockSelectedValues.includes(opt.value);
  });

  fireEvent.change(select);

  expect(onChangeMock).toHaveBeenCalledWith(mockSelectedValues);
});
