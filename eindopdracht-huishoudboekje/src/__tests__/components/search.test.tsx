import { SearchInput } from '@/app/components/search';
import { render, screen, fireEvent } from '@testing-library/react';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test('calls onSearch with debounced, trimmed, and lowercased input', () => {
  const onSearchMock = jest.fn();
  render(<SearchInput onSearch={onSearchMock} />);

  const input = screen.getByRole('textbox');

  fireEvent.change(input, { target: { value: '  Hello World  ' } });

  jest.advanceTimersByTime(300);

  expect(onSearchMock).toHaveBeenCalledTimes(1);
  expect(onSearchMock).toHaveBeenCalledWith('hello world');
});

test('debounces onSearch calls', () => {
  const onSearchMock = jest.fn();
  render(<SearchInput onSearch={onSearchMock} />);

  const input = screen.getByRole('textbox');

  fireEvent.change(input, { target: { value: 'a' } });
  jest.advanceTimersByTime(100);

  fireEvent.change(input, { target: { value: 'ab' } });
  jest.advanceTimersByTime(100);

  fireEvent.change(input, { target: { value: 'abc' } });
  jest.advanceTimersByTime(300);

  expect(onSearchMock).toHaveBeenCalledTimes(1);
  expect(onSearchMock).toHaveBeenCalledWith('abc');
});

