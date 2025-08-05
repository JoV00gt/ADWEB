'use client';

import { BudgetBookTable } from '../components/budgetbook-table';
import { Pagination } from '../components/pagination';
import { useState } from 'react';
import { paginate } from '../lib/utils/pagination';
import { useArchivedBudgetBooks } from '../lib/hooks/useArchivedBooks';
import { Spinner } from '../components/spinner';
import { SearchInput } from '../components/search';


export default function AcrhivePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { budgetBooks, userId, loading } = useArchivedBudgetBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const ITEMS_PER_PAGE = 5;

  const filteredBooks = budgetBooks.filter((book) => book.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const { paginatedItems: paginatedBooks, totalPages } = paginate(filteredBooks, currentPage, ITEMS_PER_PAGE);

  if(loading) {
    return ( <Spinner/>)
  }

  return (
    <div className="overflow-x-auto flex items-center justify-center min-h-screen">
      <div className="max-w-4xl w-full p-4 bg-white shadow rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Huishoudboekjes Archief</h1>
          <SearchInput placeholder="Zoek in archief..." onSearch={(value) => {setSearchQuery(value.trim().toLowerCase())}} />
        </div>
        <BudgetBookTable currentUser={userId} budgetBooks={paginatedBooks} isArchived={true} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}/>
      </div>
    </div>
  );
}