'use client';

import { useState } from 'react';
import { addTransactions } from '@/app/lib/actions/transactions-actions';
import TransactionRow from './transaction-row';
import { useRouter } from 'next/navigation';
import { validateTransactions } from '@/app/lib/utils/validation-rules';
import ErrorMessage from '../error';
import { useCategories } from '@/app/lib/hooks/useCategories';

const MAX_ROWS = 10;

export default function TransactionForm({ budgetBookId }: { budgetBookId: string }) {
  const router = useRouter();
  const [transactions, setTransactions] = useState([
    { amount: '', type: 'uitgave', date: new Date(), categoryId: '' },
  ]);
  const [error, setError] = useState('');
  const categories = useCategories(budgetBookId);

  const handleAddRow = () => {
    if (transactions.length >= MAX_ROWS) {
      setError('Maximaal 10 transacties toegestaan');
      return;
    }
    setError('');
    setTransactions(prev => [
      { amount: '', type: 'uitgave', date: new Date(), categoryId: '' },
      ...prev,
    ]);
  };

  const handleInputChange = (
    index: number,
    field: 'amount' | 'type' | 'date' | 'categoryId',
    value: string
  ) => {
  setError('');
  setTransactions(prev => {
    const updated = [...prev];

    if (field === 'date') {
      updated[index] = { ...updated[index], date: new Date(value) };
    } else if (field === 'amount') {
      updated[index] = { ...updated[index], amount: value };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }

    return updated;
  });
  };

  const handleDeleteRow = (index: number) => {
    setError('');
    setTransactions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setError('');
    const validationError = validateTransactions(transactions);
      if (validationError) {
        setError(validationError);
        return;
      }
    try {
      await addTransactions(transactions, budgetBookId);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis bij opslaan.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-semibold mb-6">Transacties toevoegen</h1>

     <ErrorMessage message={error} />

      {transactions.map((tx, index) => (
        <TransactionRow
          key={index}
          index={index}
          transaction={tx}
          onChange={handleInputChange}
          onDelete={handleDeleteRow}
          canDelete={transactions.length > 1}
          categories={categories}
        />
      ))}

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleAddRow}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Voeg transactie toe
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Opslaan
        </button>
      </div>
    </div>
  );
}
