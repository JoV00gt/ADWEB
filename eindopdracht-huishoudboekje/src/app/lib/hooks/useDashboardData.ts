'use client';

import { useEffect, useState } from 'react';
import { getUserId } from '../actions/auth-actions';
import { listenBudgetBooks } from '../listeners/budgetbook-listener';
import { listenTransactions } from '../listeners/transaction-listener';
import { listenCategories } from '../listeners/category-listener';
import type { BudgetBook, Category, Transaction } from '../definitions';

export function useDashboardData(isArchived: boolean) {
  const [userId, setUserId] = useState<string | null>(null);
  const [budgetBooks, setBudgetBooks] = useState<BudgetBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<BudgetBook | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function init() {
      const uid = await getUserId();
      if (!uid) return;

      setUserId(uid);

      unsubscribe = listenBudgetBooks((books) => {
        const filtered = books.filter((b) => b.archived === isArchived);
        setBudgetBooks(filtered);
        if (!selectedBook && filtered.length > 0) {
          setSelectedBook(filtered[0]);
        }
      }, uid);
    }

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [isArchived]);

  useEffect(() => {
    if (!selectedBook) return;

    const unsubscribe = listenTransactions(
      setTransactions,
      selectedBook.id,
      selectedMonth
    );

    return unsubscribe;
  }, [selectedBook, selectedMonth]);

  useEffect(() => {
    if (!selectedBook) return;

    const unsubscribe = listenCategories(setCategories, selectedBook.id);
    return unsubscribe;
  }, [selectedBook]);

  return {
    userId,
    budgetBooks,
    selectedBook,
    setSelectedBook,
    transactions,
    categories,
    selectedMonth,
    setSelectedMonth,
  };
}
