'use client';

import { Category, Transaction } from '@/app/lib/definitions';
import { calculateCategoryUsage } from '@/app/lib/utils/category-utils';
import { paginate } from '@/app/lib/utils/pagination';
import clsx from 'clsx';
import { useState } from 'react';
import { Pagination } from '../pagination';

export function CategoryOverview({ categories, transactions }: { categories: Category[], transactions: Transaction[] }) {
     const ITEMS_PER_PAGE = 5;
     const [currentPage, setCurrentPage] = useState(1);

    const { paginatedItems: paginatedCategories, totalPages } = paginate(
        categories,
        currentPage,
        ITEMS_PER_PAGE
    );

  return (
    <div className="w-full md:w-1/3 p-4 bg-gray-100 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Categorieën overzicht</h3>
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
                    })}>
                    {isOver ? `€${available.toFixed(2)} over budget heen` : `€${available.toFixed(2)} beschikbaar`}
                </span>
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
    </div>
  );
}
