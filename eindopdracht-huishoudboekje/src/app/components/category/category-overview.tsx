'use client';

import { Category, Transaction } from '@/app/lib/definitions';
import clsx from 'clsx';
import { useState } from 'react';
import { Pagination } from '../pagination';
import Link from 'next/link';
import { deleteCategory } from '@/app/lib/actions/category-actions';
import { ConfirmDeleteModal } from '../confirm-delete-modal';
import ErrorMessage from '../error';
import { usePagination } from '@/app/lib/hooks/usePagination';
import { useCategoryUsages } from '@/app/lib/hooks/useCategoryUsages';

export function CategoryOverview({
  categories,
  transactions,
  budgetBookId,
  currentUser,
  ownerId,
}: {
  categories: Category[];
  transactions: Transaction[];
  budgetBookId: string;
  currentUser: string | null;
  ownerId: string;
}) {
  const {currentPage, setCurrentPage, paginatedItems, totalPages,} = usePagination(categories, 5);
  const categoriesWithUsage = useCategoryUsages(paginatedItems, transactions);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setError('');
    try {
      await deleteCategory(budgetBookId, categoryToDelete.id);
      setShowModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      setError('Fout bij het verwijderen');
    }
  };

  return (
    <div className="w-full md:w-1/2 p-4 bg-gray-100 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Categorieën overzicht</h3>
      <ErrorMessage message={error} />
      {categories.length === 0 ? (
        <p className="text-center text-gray-500 italic">Geen categorieën gevonden.</p>
      ) : (
        <>
          <div className="space-y-4">
            {categoriesWithUsage.map(({ category, usage }) => {
              const { available, percentageUsed, isOver, isWarning } = usage;

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
                      {isOver
                        ? `€${available.toFixed(2)} over budget heen`
                        : `€${available.toFixed(2)} beschikbaar`}
                    </span>
                    {ownerId === currentUser && (
                      <div className="flex items-center gap-8">
                        <Link
                          href={`/dashboard/${budgetBookId}/categories/${category.id}/edit`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Bewerken
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(category)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
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
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      <ConfirmDeleteModal
        isOpen={showModal}
        title="Categorie verwijderen?"
        message={`Weet je zeker dat je de categorie "${categoryToDelete?.name}" wilt verwijderen?`}
        onCancel={() => setShowModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
