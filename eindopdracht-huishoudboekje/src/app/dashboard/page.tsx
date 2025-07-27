'use client';

import { BudgetBookTable } from '../components/budgetbook-table';
import { Pagination } from '../components/pagination';
import { useEffect, useState } from 'react';
import type { BudgetBook } from '../lib/definitions';
import { listenBudgetBooks } from '../services/budgetBookService';


export default function DashboardPage() {
  const [budgetBooks, setBudgetBooks] = useState<BudgetBook[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const unsubscribe = listenBudgetBooks((data) => {
      setBudgetBooks(data);
    });

    return () => unsubscribe();
  }, []);

  const totalPages = Math.ceil(budgetBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = budgetBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );


  return (
    <div className="overflow-x-auto flex items-center justify-center min-h-screen">
      <div className="max-w-4xl w-full p-4 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">Huishoudboekjes</h1>
        <BudgetBookTable budgetBooks={paginatedBooks} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}