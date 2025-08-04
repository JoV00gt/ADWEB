'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TransactionRow from './transaction-row';
import { updateTransaction } from '@/app/lib/actions/transactions-actions';
import { validateTransactions } from '@/app/lib/utils/validation-rules';

export default function EditTransactionForm({budgetBookId, transaction}: {budgetBookId: string, transaction: any}) {
  const router = useRouter();
  const [tx, setTx] = useState({
    amount: transaction.amount.toString(),
    type: transaction.type,
    date: transaction.date,
  });
  const [error, setError] = useState('');

  const handleChange = (index: number, field: 'amount' | 'type' | 'date', value: string) => {
    setTx(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    const error = validateTransactions([tx]);
    if (error) {
      setError(error);
      return;
    }

    try {
      await updateTransaction(budgetBookId, transaction.id, {amount: tx.amount, type: tx.type, date: new Date(tx.date)});
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis bij opslaan.');
    }
  };

  return (
    <>
      {error && <div className="mb-4 text-red-600 font-medium">{error}</div>}

      <TransactionRow
        index={0}
        transaction={tx}
        onChange={handleChange}
        onDelete={() => {}}
        canDelete={false}
        isEditing={true}
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
