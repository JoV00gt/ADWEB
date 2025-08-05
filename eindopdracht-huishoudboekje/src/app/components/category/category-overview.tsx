'use client';

import { Category, Transaction } from '@/app/lib/definitions';
import clsx from 'clsx';

export function CategoryOverview({ categories, transactions }: { categories: Category[], transactions: Transaction[]}) {

  const getUsedAmount = (categoryId: string) => {
    return transactions
      .filter(tx => tx.id === categoryId)
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  return (
    <div className="w-full md:w-1/3 p-4 bg-gray-100 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Categorieën overzicht</h3>
      <div className="space-y-4">
        {categories.map(category => {
          const used = getUsedAmount(category.id);
          const available = category.budget - used;
          const percentageUsed = Math.min((used / category.budget) * 100, 100);
          const isOver = used > category.budget;
          const isWarning = used >= 0.9 * category.budget && !isOver;

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
                  €{available.toFixed(2)} beschikbaar
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
    </div>
  );
}
