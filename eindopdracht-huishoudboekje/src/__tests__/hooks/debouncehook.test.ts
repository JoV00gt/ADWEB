import { useDebounced } from '@/app/lib/hooks/useDebounce';
import { renderHook, act } from '@testing-library/react';

jest.useFakeTimers();

describe('useDebounced', () => {
  let mockOnInput: jest.Mock;

  beforeEach(() => {
    mockOnInput = jest.fn();
    jest.clearAllTimers();
  });

  test('returns initial value as empty string', () => {
    const { result } = renderHook(() => useDebounced(mockOnInput));
    expect(result.current.value).toBe('');
  });

  test('calls onInput after delay with trimmed and lowercased value', () => {
    const { result } = renderHook(() => useDebounced(mockOnInput, 500));

    act(() => {
      result.current.setValue('  Hello World  ');
    });

    jest.advanceTimersByTime(499);
    expect(mockOnInput).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(mockOnInput).toHaveBeenCalledTimes(1);
    expect(mockOnInput).toHaveBeenCalledWith('hello world');
  });

  test('resets timer if value changes before delay finishes', () => {
    const { result } = renderHook(() => useDebounced(mockOnInput, 300));

    act(() => {
      result.current.setValue('First');
    });
    jest.advanceTimersByTime(200);

    act(() => {
      result.current.setValue('Second');
    });

    jest.advanceTimersByTime(299);
    expect(mockOnInput).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(mockOnInput).toHaveBeenCalledWith('second');
  });

  test('works with default delay (300ms)', () => {
    const { result } = renderHook(() => useDebounced(mockOnInput));

    act(() => {
      result.current.setValue('test');
    });

    jest.advanceTimersByTime(300);
    expect(mockOnInput).toHaveBeenCalledWith('test');
  });
});
