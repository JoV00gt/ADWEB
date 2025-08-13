import { useEffect, useState } from 'react';
import type { BudgetBook } from '../definitions';

export function useSelectedBook(budgetBooks: BudgetBook[]) {
  const [selectedBook, setSelectedBook] = useState<BudgetBook | null>(null);

  useEffect(() => {
    if (!selectedBook && budgetBooks.length > 0) { 
      setSelectedBook(budgetBooks[0]);
    }
  }, [budgetBooks, selectedBook]);

  return { selectedBook, setSelectedBook };
}
