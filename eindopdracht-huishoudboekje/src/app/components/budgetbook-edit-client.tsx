'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/lib/hooks/useUser';
import EditBudgetBookForm from '@/app/components/budgetbook-edit-form';
import { Spinner } from './spinner';

export default function BudgetBookEditClient({ book }: { book: any }) {
  const userId = useUser();
  const router = useRouter();

  useEffect(() => {
    if (userId && book.ownerId !== userId) {
      router.replace('/dashboard'); 
    }
  }, [userId, book.ownerId, router]);

  if (userId === null) {
    return <Spinner/>;
  }4
  return <EditBudgetBookForm book={book} />;
}
