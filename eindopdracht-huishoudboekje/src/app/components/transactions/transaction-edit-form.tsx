'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TransactionRow from './transaction-row';
import { updateTransaction } from '@/app/lib/actions/transactions-actions';
import { validateTransactions } from '@/app/lib/utils/validation-rules';
import { listenCategories } from '@/app/lib/listeners/category-listener';
import { Category } from '@/app/lib/definitions';
import ErrorMessage from '../error';

export default function EditTransactionForm({budgetBookId, transaction}: {budgetBookId: string, transaction: any}) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tx, setTx] = useState({
    amount: transaction.amount.toString(),
    type: transaction.type,
    date: transaction.date,
    categoryId: transaction.categoryId || ''
  });
  const [error, setError] = useState('');

  const handleChange = (index: number, field: 'amount' | 'type' | 'date' | 'categoryId', value: string) => {
    setTx(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const unsubscribe = listenCategories(setCategories, budgetBookId);
    return () => unsubscribe();
  }, [budgetBookId]);

  const handleSubmit = async () => {
    setError('');
    const error = validateTransactions([tx]);
    if (error) {
      setError(error);
      return;
    }

    try {
      await updateTransaction(budgetBookId, transaction.id, {amount: tx.amount, type: tx.type, date: new Date(tx.date), categoryId: tx.categoryId || null,});
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis bij opslaan.');
    }
  };

  return (
    <>
      <ErrorMessage message={error} />

      <TransactionRow
        index={0}
        transaction={tx}
        onChange={handleChange}
        onDelete={() => {}}
        canDelete={false}
        isEditing={true}
        categories={categories}
      />

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Opslaan
        </button>
      </div>
    </>
  );
}
