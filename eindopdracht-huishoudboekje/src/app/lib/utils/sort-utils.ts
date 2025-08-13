import { Transaction } from '../definitions';

export function sortTransactionsByDate(transactions: Transaction[]) {
  return [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
