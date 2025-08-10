'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';

import { BudgetBookTable } from '../components/budgetbook-table';
import { Pagination } from '../components/pagination';
import { MonthSelector } from '../components/month-selector';
import { TransactionStats } from '../components/transactions/transaction-stats';
import { TransactionList } from '../components/transactions/transaction.list';
import { TransactionListSkeleton, TransactionStatsSkeleton } from '../components/skeletons';
import { paginate } from '../lib/utils/pagination';
import { CategoryOverview } from '../components/category/category-overview';
import { CategoryExpensesChart } from '../components/bar-chart';
import { DailyBalanceChart } from '../components/line-chart';
import { SearchInput } from '../components/search';
import { useDashboardData } from '../lib/hooks/useDashboardData';

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    userId,
    budgetBooks,
    selectedBook,
    setSelectedBook,
    transactions,
    categories,
    selectedMonth,
    setSelectedMonth,
  } = useDashboardData(false);
  const ITEMS_PER_PAGE = 5;


  const filteredBooks = budgetBooks.filter((book) =>
    book.name.toLowerCase().includes(searchQuery)
  );

  const { paginatedItems: paginatedBooks, totalPages } = paginate(
    filteredBooks,
    currentPage,
    ITEMS_PER_PAGE
  );

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="overflow-x-auto flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-6xl w-full p-4 space-y-6">
        <h1 className="text-2xl font-semibold">Huishoudboekjes</h1>
        <div className="flex items-center justify-between">
          <SearchInput
            placeholder="Zoek in huishoudboekjes..."
            onSearch={(value) => {setSearchQuery(value.trim().toLowerCase());}}
          />
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
              <div className="flex justify-between mt-6 mb-2 w-full">
                <div className="w-1/2 flex justify-end pr-4">
                  <Link
                    href={`/dashboard/${selectedBook.id}/transactions/create`}
                    className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Transactie toevoegen
                  </Link>
                </div>
                <div className="w-1/2 flex justify-end">
                  <Link
                    href={`/dashboard/${selectedBook.id}/categories/create`}
                    className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Categorie toevoegen
                  </Link>
                </div>
              </div>
            )}

            <div className="md:flex gap-6">
              <div className="md:w-1/2">
                {transactions.length === 0 && (
                  <p className="text-center text-gray-400 italic mt-6">Geen transacties gevonden.</p>
                )}
                {transactions.length > 0 && (
                  <>
                    <Suspense fallback={<TransactionListSkeleton />}>
                      <TransactionList
                        ownerId={selectedBook.ownerId}
                        currentUser={userId}
                        transactions={transactions}
                        budgetBookId={selectedBook.id}
                        categories={categories}
                      />
                    </Suspense>
                  </>
                )}
              </div>

              <CategoryOverview
                ownerId={selectedBook.ownerId}
                currentUser={userId}
                budgetBookId={selectedBook.id}
                categories={categories}
                transactions={transactions}
              />
            </div>
            {transactions.length > 0 && (
              <div className="mt-10 grid md:grid-cols-2 gap-6">
                <DailyBalanceChart transactions={transactions} selectedMonth={selectedMonth} />
                {categories.length > 0 && (
                  <CategoryExpensesChart categories={categories} transactions={transactions} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
