import { useEffect, useState } from 'react';
import { listenBudgetBooks } from '../listeners/budgetbook-listener';
import type { BudgetBook } from '../definitions'; 

export function useBudgetBooks(isArchived: boolean, userId: string | null) {
  const [budgetBooks, setBudgetBooks] = useState<BudgetBook[]>([]);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = listenBudgetBooks((books) => {
      const filtered = books.filter(b => b.archived === isArchived);
      setBudgetBooks(filtered);
    }, userId);

    return () => unsubscribe();
  }, [isArchived, userId]);

  return budgetBooks;
}