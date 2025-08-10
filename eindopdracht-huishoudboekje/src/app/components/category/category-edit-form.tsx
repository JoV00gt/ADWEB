'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCategory } from '@/app/lib/actions/category-actions';
import { formatDate } from '@/app/lib/utils/format-date';
import ErrorMessage from '../error';
import { validateBudget, validateName } from '@/app/lib/utils/validation-rules';

export default function EditCategoryForm({
  category,
  budgetBookId,
}: {
  category: any;
  budgetBookId: string;
}) {
  const router = useRouter();
  const [cat, setCat] = useState({
    name: category.name,
    budget: category.budget.toString(),
    endDate: category.endDate ? formatDate(category.endDate) : '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    try {
      validateName(cat.name);
      validateBudget(cat.budget);
      await updateCategory(budgetBookId, category.id, {
        name: cat.name,
        budget: Number(cat.budget),
        endDate: cat.endDate ? new Date(cat.endDate) : null,
      });

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis bij het opslaan.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold mb-6">Categorie bewerken</h1>

      <ErrorMessage message={error} />

      <div className="mb-4">
        <label htmlFor='name' className="block mb-1 font-medium">Naam</label>
        <input
          id="name"
          type="text"
          className="border p-2 rounded w-full"
          value={cat.name}
          onChange={(e) =>
            setCat((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </div>

      <div className="mb-6">
        <label htmlFor='budget' className="block mb-1 font-medium">Budget limiet (€)</label>
        <input
          id='budget'
          type="number"
          className="border p-2 rounded w-full"
          value={cat.budget}
          onChange={(e) =>
            setCat((prev) => ({ ...prev, budget: e.target.value }))
          }
        />
      </div>

      <div className="mb-6">
        <label htmlFor="date" className="block mb-1 font-medium">Einddatum (optioneel)</label>
        <input
          id="date"
          type="date"
          className="border p-2 rounded w-full"
          value={cat.endDate}
          onChange={(e) =>
            setCat((prev) => ({ ...prev, endDate: e.target.value }))
          }
        />
      </div>

      <div className="flex justify-end">
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
