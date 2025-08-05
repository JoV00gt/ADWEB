'use client';

import { Category, Transaction } from '@/app/lib/definitions';
import { calculateCategoryUsage } from '@/app/lib/utils/category-utils';
import { paginate } from '@/app/lib/utils/pagination';
import clsx from 'clsx';
import { useState } from 'react';
import { Pagination } from '../pagination';
import Link from 'next/link';
import { deleteCategory } from '@/app/lib/actions/category-actions';

export function CategoryOverview({ categories, transactions, budgetBookId, currentUser, ownerId }: { categories: Category[], transactions: Transaction[], budgetBookId: string, currentUser: string | null, ownerId: string }) {
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');

  const { paginatedItems: paginatedCategories, totalPages } = paginate(
    categories,
    currentPage,
    ITEMS_PER_PAGE
  );

    const handleDelete = async (bookId: string, categoryId: string) => {
      setError('');
      try {
        await deleteCategory(bookId, categoryId);
      } catch (error) {
        setError('Fout bij het verwijderen');
      }
    };


  return (
    <div className="w-full md:w-1/2 p-4 bg-gray-100 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Categorieën overzicht</h3>
      {error && <p className="text-red-600">{error}</p>}
      {categories.length === 0 ? (
        <p className="text-center text-gray-500 italic">Geen categories gevonden.</p>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedCategories.map(category => {
              const {
                available,
                percentageUsed,
                isOver,
                isWarning,
              } = calculateCategoryUsage(category.id, Number(category.budget), transactions, category.endDate);

              return (
                <div key={category.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <span
                      className={clsx('text-sm font-semibold', {
                        'text-red-600': isOver,
                        'text-yellow-600': isWarning,
                        'text-green-600': !isOver && !isWarning,
                      })}
                    >
                      {isOver ? `€${available.toFixed(2)} over budget heen` : `€${available.toFixed(2)} beschikbaar`}
                    </span>
                    {ownerId === currentUser && (
                      <div className='flex items-center gap-8'>
                        <Link
                          href={`/dashboard/${budgetBookId}/categories/${category.id}/edit`}
                          className="text-sm text-blue-600 hover:underline">
                          Bewerken
                        </Link>
                        <button
                          onClick={() => handleDelete(budgetBookId, category.id)}
                          className="text-sm text-red-600 hover:text-red-800">
                          Verwijderen
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="h-2 w-full bg-gray-300 rounded">
                    <div
                      className={clsx('h-2 rounded', {
                        'bg-green-500': !isOver && !isWarning,
                        'bg-yellow-500': isWarning,
                        'bg-red-500': isOver,
                      })}
                      style={{ width: `${percentageUsed}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}
    </div>
  );
}
