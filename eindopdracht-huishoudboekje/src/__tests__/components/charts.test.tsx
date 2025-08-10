import React, { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { Transaction, Category } from '@/app/lib/definitions';
import * as chartUtils from '@/app/lib/utils/chart-utils';
import { DailyBalanceChart } from '@/app/components/line-chart';
import { CategoryExpensesChart } from '@/app/components/bar-chart';

class mockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = mockResizeObserver;

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => (
      <OriginalModule.ResponsiveContainer width={800} height={800}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
});

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 100,
    type: 'inkomen',
    date: new Date(2023, 7, 10),
    categoryId: 'cat1',
  },
  {
    id: '2',
    amount: 50,
    type: 'uitgave',
    date: new Date(2023, 7, 10),
    categoryId: 'cat2',
  },
  {
    id: '3',
    amount: 200,
    type: 'inkomen',
    date: new Date(2023, 7, 15),
    categoryId: 'cat1',
  },
];

const mockGroupedData = [
  { date: '10', income: 100, expense: 50 },
  { date: '15', income: 200, expense: 0 },
];


const mockCategories: Category[] = [
  { id: 'cat1', name: 'Food', budget: 100, budgetBookId: 'book1' },
  { id: 'cat2', name: 'Transport', budget: 50, budgetBookId: 'book1' },
];

const mockCategoryTransactions: Transaction[] = [
  {
    id: '1',
    amount: 40,
    type: 'uitgave',
    date: new Date(2023, 7, 5),
    categoryId: 'cat1',
  },
  {
    id: '2',
    amount: 30,
    type: 'uitgave',
    date: new Date(2023, 7, 10),
    categoryId: 'cat2',
  },
];

const mockCategoryData = [
  { name: 'Food', expense: 40, budget: 100 },
  { name: 'Transport', expense: 30, budget: 50 },
];

jest.spyOn(chartUtils, 'groupByDay').mockImplementation(() => mockGroupedData);

test('DailyBalanceChart renders chart with mocked grouped data', () => {
  render(<DailyBalanceChart transactions={mockTransactions} selectedMonth={7} />);

  expect(screen.getByText('Dagelijkse inkomsten / uitgaven')).toBeInTheDocument();

  const legendTexts = Array.from(document.querySelectorAll('.recharts-legend-item-text')).map(
    (node) => node.textContent
  );

  expect(legendTexts).toContain('Inkomen');
  expect(legendTexts).toContain('Uitgaven');
});

jest.spyOn(chartUtils, 'calculateExpensesPerCategory').mockImplementation(() => mockCategoryData);

test('CategoryExpensesChart renders chart with mocked grouped data', () => {
  render(<CategoryExpensesChart categories={mockCategories} transactions={mockCategoryTransactions} />);

  expect(screen.getByText('Uitgaven per categorie')).toBeInTheDocument();

  expect(screen.getByText('Food')).toBeInTheDocument();
  expect(screen.getByText('Transport')).toBeInTheDocument();
});
