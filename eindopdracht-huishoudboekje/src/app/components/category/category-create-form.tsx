'use client';

import { useState } from 'react';
import { addCategory } from '@/app/lib/actions/category-actions';
import { useRouter } from 'next/navigation';

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

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="mb-4">
        <label className="block mb-1">Naam *</label>
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Maximaal budget *</label>
        <input
          type="number"
          className="border p-2 rounded w-full"
          value={budget}
          onChange={e => setBudget(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Einddatum (optioneel)</label>
        <input
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
