'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';

import { BudgetBookTable } from '../components/budgetbook-table';
import { Pagination } from '../components/pagination';
import { MonthSelector } from '../components/month-selector';
import { listenBudgetBooks } from '../lib/listeners/budgetbook-listener';
import { listenTransactions } from '../lib/listeners/transaction-listener';
import { getUserId } from '../lib/actions/auth-actions';
import type { BudgetBook, Category, Transaction } from '../lib/definitions';
import { TransactionStats } from '../components/transactions/transaction-stats';
import { TransactionList } from '../components/transactions/transaction.list';
import { TransactionListSkeleton, TransactionStatsSkeleton } from '../components/skeletons';
import { paginate } from '../lib/utils/pagination';
import { listenCategories } from '../lib/listeners/category-listener';
import { CategoryOverview } from '../components/category/category-overview';

export default function DashboardPage() {
  const [budgetBooks, setBudgetBooks] = useState<BudgetBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<BudgetBook | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTxPage, setCurrentTxPage] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  const ITEMS_PER_PAGE = 5;
  const TRANSACTIONS_PER_PAGE = 8;

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function initListener() {
      const userId = await getUserId();
      if (!userId) return;
      setUserId(userId);

      unsubscribe = listenBudgetBooks((books: BudgetBook[]) => {
        setBudgetBooks(books);
        if (!selectedBook && books.length > 0) {
          setSelectedBook(books[0]);
        }
      }, userId);
    }

    initListener();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!selectedBook) return;

    setCurrentTxPage(1);

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

const { paginatedItems: paginatedBooks, totalPages } = paginate(
  budgetBooks,
  currentPage,
  ITEMS_PER_PAGE
);

const { paginatedItems: paginatedTransactions, totalPages: totalTxPages } = paginate(
  transactions,
  currentTxPage,
  TRANSACTIONS_PER_PAGE
);

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="overflow-x-auto flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-6xl w-full p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Huishoudboekjes</h1>
          <Link
            href="/dashboard/create"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Nieuw huishoudboekje
          </Link>
        </div>

        <BudgetBookTable
          currentUser={userId}
          budgetBooks={paginatedBooks}
          isArchived={false}
          onSelectBook={setSelectedBook}
          selectedBook={selectedBook}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {selectedBook && (
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{selectedBook.name}</h2>
              <MonthSelector selectedMonth={selectedMonth} onChange={setSelectedMonth} />
            </div>
            <Suspense fallback={<TransactionStatsSkeleton />}>
                <TransactionStats transactions={sortedTransactions} />
            </Suspense>
            {selectedBook.ownerId === userId && (
              <div className="flex justify-between items-center mt-6 mb-2">
                <Link
                  href={`/dashboard/${selectedBook.id}/transactions/create`}
                  className="text-sm px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Transactie toevoegen
                </Link>
                <Link
                  href={`/dashboard/${selectedBook.id}/categories/create`}
                  className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Categorie toevoegen
                </Link>
              </div>
            )}
            {transactions.length === 0 ? (
              <p className="text-center text-gray-400 italic mt-6">Geen transacties gevonden.</p>
            ) : (
              <div className="md:flex gap-6">
                <div className="md:w-2/3">
                  <Suspense fallback={<TransactionListSkeleton />}>
                    <TransactionList
                      ownerId={selectedBook.ownerId}
                      currentUser={userId}
                      transactions={paginatedTransactions}
                      budgetBookId={selectedBook.id}
                      categories={categories}/>
                  </Suspense>
                  <Pagination
                      currentPage={currentTxPage}
                      totalPages={totalTxPages}
                      onPageChange={setCurrentTxPage}/>
                </div>
                <CategoryOverview
                  categories={categories}
                  transactions={transactions}/>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
