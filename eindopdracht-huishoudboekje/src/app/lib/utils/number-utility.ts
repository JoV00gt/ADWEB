import type { Transaction } from '../definitions';

export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter(tx => tx.type === 'inkomen')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
}

export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter(tx => tx.type === 'uitgave')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
}

export const currencyFormatter = (value: any) =>
  typeof value === 'number' ? `€${value.toFixed(2)}` : value;