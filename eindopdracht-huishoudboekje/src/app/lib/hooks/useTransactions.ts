import { useEffect, useState } from 'react';
import { listenTransactions } from '../listeners/transaction-listener'; 
import type { Transaction } from '../definitions';

export function useTransactions(selectedBookId: string | null, selectedMonth: number) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!selectedBookId) return;

    const unsubscribe = listenTransactions(setTransactions, selectedBookId, selectedMonth);
    return () => unsubscribe();
  }, [selectedBookId, selectedMonth]);

  return transactions;
}