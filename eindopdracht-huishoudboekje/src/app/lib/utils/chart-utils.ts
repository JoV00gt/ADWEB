import { eachDayOfInterval, format, startOfMonth, endOfMonth } from 'date-fns';
import type { Category, Transaction } from '../definitions';

export function groupByDay(transactions: Transaction[], month: number) {
  if (transactions.length === 0) return [];

  const year = new Date(transactions[0].date).getFullYear();

  const days = eachDayOfInterval({
    start: startOfMonth(new Date(year, month)),
    end: endOfMonth(new Date(year, month)),
  });

  const dayMap = new Map<string, { income: number; expense: number }>();

  days.forEach((day) => {
    const key = format(day, 'yyyy-MM-dd');
    dayMap.set(key, { income: 0, expense: 0 });
  });

  transactions.forEach(({ date, amount, type }) => {
    const dayKey = format(new Date(date), 'yyyy-MM-dd');
    if (!dayMap.has(dayKey)) return;

    const entry = dayMap.get(dayKey)!;
    if (type === 'inkomen') {
      entry.income += Number(amount);
    } else {
      entry.expense += Number(amount);
    }
  });

  return Array.from(dayMap.entries()).map(([date, { income, expense }]) => ({
    date: format(new Date(date), 'dd MMM'),
    income,
    expense,
  }));
}

export function calculateExpensesPerCategory(categories: Category[], transactions: Transaction[]) {
  const categoryMap = new Map<string, { expense: number; budget: number }>();

  categories.forEach(({ id, name, budget }) => {
    categoryMap.set(name, { expense: 0, budget });
  });

  transactions.forEach(({ categoryId, amount, type }) => {
    if (type === 'uitgave' && categoryId) {
      const cat = categories.find(c => c.id === categoryId);
      if (cat) {
        const current = categoryMap.get(cat.name);
        if (current) {
          current.expense += Number(amount);
        }
      }
    }
  });

  return Array.from(categoryMap.entries())
    .map(([name, { expense, budget }]) => ({ name, expense, budget }))
    .filter(({ expense, budget }) => expense > 0 || budget > 0);
}