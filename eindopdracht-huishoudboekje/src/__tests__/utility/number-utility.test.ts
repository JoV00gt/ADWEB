import { currencyFormatter, getTotalExpenses, getTotalIncome } from "@/app/lib/utils/number-utility";


const mockTransactions = [
  { type: 'inkomen', amount: '1000' },
  { type: 'inkomen', amount: '500.50' },
  { type: 'uitgave', amount: '200' },
  { type: 'uitgave', amount: '150.75' },
  { type: 'inkomen', amount: '0' },
  { type: 'uitgave', amount: '0' },
] as any;

const mockNoIncomeTransactions = [
  { type: 'uitgave', amount: '100' },
  { type: 'uitgave', amount: '50' },
] as any;

const mockNoExpenseTransactions = [
  { type: 'inkomen', amount: '100' },
  { type: 'inkomen', amount: '50' },
] as any;

describe('Transaction Totals', () => {
  test('calculates total income correctly', () => {
    expect(getTotalIncome(mockTransactions)).toBe(1500.5);
  });

  test('calculates total expenses correctly', () => {
    expect(getTotalExpenses(mockTransactions)).toBe(350.75);
  });

  test('returns 0 when there is no income', () => {
    expect(getTotalIncome(mockNoIncomeTransactions)).toBe(0);
  });

  test('returns 0 when there is no expense', () => {
    expect(getTotalExpenses(mockNoExpenseTransactions)).toBe(0);
  });

  test('formats only numbers as currency', () => {
    expect(currencyFormatter(123.456)).toBe('€123.46');
    expect(currencyFormatter('test')).toBe('test');
  });
});
