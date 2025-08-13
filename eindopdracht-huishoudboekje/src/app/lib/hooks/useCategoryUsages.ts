import { useMemo } from 'react';
import { calculateCategoryUsage } from '@/app/lib/utils/category-utils';
import { Category, Transaction } from '../definitions';

export function useCategoryUsages(categories: Category[], transactions: Transaction[]) {
  return useMemo(() => {
    return categories.map(category => ({
      category,
      usage: calculateCategoryUsage(
        category.id,
        Number(category.budget),
        transactions,
        category.endDate
      )
    }));
  }, [categories, transactions]);
}
