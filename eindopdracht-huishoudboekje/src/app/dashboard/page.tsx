'use client';

import { Suspense } from 'react';
import Link from 'next/link';

import { BudgetBookTable } from '../components/budgetbook-table';
import { Pagination } from '../components/pagination';
import { MonthSelector } from '../components/month-selector';
import { TransactionStats } from '../components/transactions/transaction-stats';
import { TransactionList } from '../components/transactions/transaction.list';
import { TransactionListSkeleton, TransactionStatsSkeleton } from '../components/skeletons';
import { CategoryOverview } from '../components/category/category-overview';
import { CategoryExpensesChart } from '../components/bar-chart';
import { DailyBalanceChart } from '../components/line-chart';
import { SearchInput } from '../components/search';
import { usePagination } from '../lib/hooks/usePagination';
import { useSearch } from '../lib/hooks/useSearch';
import { sortTransactionsByDate } from '../lib/utils/sort-utils';
import { useCategories } from '../lib/hooks/useCategories';
import { useTransactions } from '../lib/hooks/useTransactions';
import { useBudgetBooks } from '../lib/hooks/useBudgetBooks';
import { useSelectedMonth } from '../lib/hooks/useSelectedMonth';
import { useSelectedBook } from '../lib/hooks/useSelectedBook';
import { useUser } from '../lib/hooks/useUser';

export default function DashboardPage() {
  const userId = useUser();
  const budgetBooks = useBudgetBooks(false, userId);
  const { selectedBook, setSelectedBook } = useSelectedBook(budgetBooks);
  const { selectedMonth, setSelectedMonth } = useSelectedMonth();
  const transactions = useTransactions(selectedBook?.id || null, selectedMonth);
  const categories = useCategories(selectedBook?.id || null);
  
  const {setSearchQuery, filteredItems} = useSearch(budgetBooks, (book, query) => book.name.toLowerCase().includes(query.toLowerCase()));
  const {paginatedItems,currentPage,totalPages,setCurrentPage} = usePagination(filteredItems, 5);

  const sortedTransactions = sortTransactionsByDate(transactions);

  return (
    <div className="overflow-x-auto flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-6xl w-full p-4 space-y-6">
        <h1 className="text-2xl font-semibold">Huishoudboekjes</h1>
        <div className="flex items-center justify-between">
          <SearchInput
            placeholder="Zoek in huishoudboekjes..."
            onSearch={setSearchQuery}
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
          budgetBooks={paginatedItems}
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
                  <Suspense fallback={<TransactionListSkeleton />}>
                    <TransactionList
                      ownerId={selectedBook.ownerId}
                      currentUser={userId}
                      transactions={transactions}
                      budgetBookId={selectedBook.id}
                      categories={categories}
                    />
                  </Suspense>
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
