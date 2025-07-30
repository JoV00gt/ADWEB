'use client';

import { BudgetBookTable } from '../components/budgetbook-table';
import { Pagination } from '../components/pagination';
import { useEffect, useState } from 'react';
import type { BudgetBook } from '../lib/definitions';
import { listenBudgetBooks } from '../lib/listeners/budgetbook-listener';
import Link from 'next/link';
import { getUserId } from '../lib/actions/auth-actions';


export default function DashboardPage() {
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

      unsubscribe = listenBudgetBooks((books: BudgetBook[]) => {
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
      <h1 className="text-2xl font-semibold">Huishoudboekjes</h1>
      <Link
        href="/dashboard/create"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Nieuw huishoudboekje
      </Link>
    </div>
    <BudgetBookTable budgetBooks={paginatedBooks} isArchived={false} />
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  </div>
</div>

  );
}