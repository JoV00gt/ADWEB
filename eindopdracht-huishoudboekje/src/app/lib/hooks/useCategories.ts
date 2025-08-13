import { useEffect, useState } from 'react';
import { Category } from '@/app/lib/definitions';
import { listenCategories } from '@/app/lib/listeners/category-listener'; 

export function useCategories(budgetBookId: string | null) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!budgetBookId) return;
    
    const unsubscribe = listenCategories(setCategories, budgetBookId);
    return () => unsubscribe();
  }, [budgetBookId]);

  return categories;
}
