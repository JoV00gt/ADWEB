'use client';

import { BudgetBookTable } from '../components/budgetbook-table';
import { Pagination } from '../components/pagination';
import { useEffect, useState } from 'react';
import type { BudgetBook } from '../lib/definitions';
import { listenArchivedBudgetBooks } from '../lib/listeners/budgetbook-listener';
import { getUserId } from '../lib/actions/auth-actions';


export default function AcrhivePage() {
  const [budgetBooks, setBudgetBooks] = useState<BudgetBook[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function initListener() {
      const userId = await getUserId();

      if (!userId) {
        return;
      }

      unsubscribe = listenArchivedBudgetBooks((books: BudgetBook[]) => {
        setBudgetBooks(books);
      }, userId);
    }

    initListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const totalPages = Math.ceil(budgetBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = budgetBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  return (
    <div className="overflow-x-auto flex items-center justify-center min-h-screen">
  <div className="max-w-4xl w-full p-4 bg-white shadow rounded-lg">
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-semibold">Huishoudboekjes Archief</h1>
    </div>
    <BudgetBookTable budgetBooks={paginatedBooks} isArchived={true} />
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  </div>
</div>

  );
}