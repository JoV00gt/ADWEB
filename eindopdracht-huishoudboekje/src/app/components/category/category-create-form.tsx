'use client';

import { useState } from 'react';
import { addCategory } from '@/app/lib/actions/category-actions';
import { useRouter } from 'next/navigation';
import ErrorMessage from '../error';

export default function CategoryForm({ budgetBookId }: { budgetBookId: string }) {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    setError('');
    try {
      await addCategory(budgetBookId, name, parseFloat(budget), endDate);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Categorie toevoegen</h2>

     <ErrorMessage message={error} />

      <div className="mb-4">
        <label htmlFor='name' className="block mb-1">Naam *</label>
        <input
          id="name"
          type="text"
          className="border p-2 rounded w-full"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor='budget' className="block mb-1">Maximaal budget *</label>
        <input
          id="budget"
          type="number"
          className="border p-2 rounded w-full"
          value={budget}
          onChange={e => setBudget(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor='date' className="block mb-1">Einddatum (optioneel)</label>
        <input
          id="date"
          type="date"
          className="border p-2 rounded w-full"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Opslaan
      </button>
    </div>
  );
}
