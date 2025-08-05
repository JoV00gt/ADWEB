import { Transaction } from '@/app/lib/definitions';

export function calculateCategoryUsage(categoryId: string, budget: number, transactions: Transaction[], categoryEndDate: Date | undefined) {
  let endDate: Date | undefined;
  if (categoryEndDate) {
       endDate = categoryEndDate instanceof Date ? categoryEndDate : new Date(categoryEndDate);
  }

  const used = transactions.filter(tx => {
    if (tx.categoryId !== categoryId || tx.type !== 'uitgave') return false;

    if (endDate) {
      const txDate = new Date(tx.date);
      if (txDate > endDate) return false;
    }
    return true;
  }).reduce((sum, tx) => sum + Number(tx.amount), 0);

  const available = budget - used;
  const percentageUsed = budget > 0 ? Math.min((used / budget) * 100, 100) : 0;
  const isOver = used > budget;
  const isWarning = used >= 0.9 * budget && !isOver;

  return {available, percentageUsed, isOver, isWarning};
}
