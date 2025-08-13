'use client';

import { BudgetBookTable } from '../components/budgetbook-table';
import { Pagination } from '../components/pagination';
import { Spinner } from '../components/spinner';
import { SearchInput } from '../components/search';
import { useArchivedBudgetBooks } from '../lib/hooks/useArchivedBooks';
import { useSearch } from '../lib/hooks/useSearch';
import { usePagination } from '../lib/hooks/usePagination';

export default function AcrhivePage() {
  const { budgetBooks, userId, loading } = useArchivedBudgetBooks();

  const { setSearchQuery, filteredItems } = useSearch(
    budgetBooks,
    (book, query) => book.name.toLowerCase().includes(query.toLowerCase())
  );

  const { currentPage, setCurrentPage, paginatedItems, totalPages } = usePagination(
    filteredItems,
    5
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="overflow-x-auto flex items-center justify-center min-h-screen">
      <div className="max-w-4xl w-full p-4 bg-white shadow rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Huishoudboekjes Archief</h1>
          <SearchInput
            placeholder="Zoek in archief..."
            onSearch={(value) => setSearchQuery(value.trim().toLowerCase())}
          />
        </div>
        <BudgetBookTable
          currentUser={userId}
          budgetBooks={paginatedItems}
          isArchived={true}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
