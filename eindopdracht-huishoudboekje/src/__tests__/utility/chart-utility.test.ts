
import { Transaction, Category } from '@/app/lib/definitions';
import { calculateExpensesPerCategory, groupByDay } from '@/app/lib/utils/chart-utils';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 100,
    type: 'inkomen',
    date: new Date('2025-08-01'),
    categoryId: 'salary',
  },
  {
    id: '2',
    amount: 50,
    type: 'uitgave',
    date: new Date('2025-08-01'),
    categoryId: 'groceries',
  },
  {
    id: '3',
    amount: 30,
    type: 'uitgave',
    date: new Date('2025-08-02'),
    categoryId: 'groceries',
  },
  {
    id: '4',
    amount: 75,
    type: 'inkomen',
    date: new Date('2025-08-03'),
    categoryId: 'freelance',
  },
  {
    id: '5',
    amount: 20,
    type: 'uitgave',
    date: new Date('2025-08-03'),
    categoryId: 'transport',
  },
];

const mockCategories: Category[] = [
  {
    id: 'groceries',
    name: 'Groceries',
    budget: 200,
    budgetBookId: 'bb1',
  },
  {
    id: 'transport',
    name: 'Transport',
    budget: 100,
    budgetBookId: 'bb1',
  },
  {
    id: 'salary',
    name: 'Salary',
    budget: 0,
    budgetBookId: 'bb1',
  },
  {
    id: 'freelance',
    name: 'Freelance',
    budget: 0,
    budgetBookId: 'bb1',
  },
];

describe('groupByDay', () => {
  test('groups transactions by day and calculates totals', () => {
    const result = groupByDay(mockTransactions, 7);
    expect(result.find(day => day.date === '01 Aug')).toEqual({
      date: '01 Aug',
      income: 100,
      expense: 50,
    });
    expect(result.find(day => day.date === '02 Aug')).toEqual({
      date: '02 Aug',
      income: 0,
      expense: 30,
    });
    expect(result.find(day => day.date === '03 Aug')).toEqual({
      date: '03 Aug',
      income: 75,
      expense: 20,
    });
  });

  test('returns empty array when no transactions are given', () => {
    const result = groupByDay([], 7);
    expect(result).toEqual([]);
  });
});

describe('calculate expenses per category', () => {
  test('returns total expense per category with budget', () => {
    const result = calculateExpensesPerCategory(mockCategories, mockTransactions);
    expect(result).toEqual([
      { name: 'Groceries', expense: 80, budget: 200 },
      { name: 'Transport', expense: 20, budget: 100 },
    ]);
  });

  test('does not return categories with zero budget and zero expense', () => {
    const result = calculateExpensesPerCategory(
      [
        ...mockCategories,
        { id: 'unused', name: 'Unused', budget: 0, budgetBookId: 'bb1' },
      ],
      mockTransactions
    );

    const unused = result.find(c => c.name === 'Unused');
    expect(unused).toBeUndefined();
  });
});
