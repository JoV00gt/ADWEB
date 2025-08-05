import { useEffect, useState } from 'react';
import type { BudgetBook } from '../definitions';
import { listenArchivedBudgetBooks } from '../listeners/budgetbook-listener';
import { getUserId } from '../actions/auth-actions';

export function useArchivedBudgetBooks() {
  const [budgetBooks, setBudgetBooks] = useState<BudgetBook[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function setupListener() {
      const id = await getUserId();
      if (!id) {
        setLoading(false);
        return;
      }

      setUserId(id);
      unsubscribe = listenArchivedBudgetBooks((books: BudgetBook[]) => {
        setBudgetBooks(books);
        setLoading(false);
      }, id);
    }

    setupListener();

    return () => unsubscribe?.();
  }, []);

  return { budgetBooks, userId, loading };
}
