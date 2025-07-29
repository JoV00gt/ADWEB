'use client';

import { updateBudgetBook } from '../lib/actions/budgetbook-actions';
import type { BudgetBook } from '../lib/definitions';

export default function EditBudgetBookForm({ book }: { book: BudgetBook }) {
  const updateAction = updateBudgetBook.bind(null, book.id);

  return (
    <form action={updateAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block font-medium">Naam</label>
        <input
          type="text"
          name="name"
          id="name"
          defaultValue={book.name}
          required
          className="w-full border rounded p-2"
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-medium">Beschrijving</label>
        <textarea
          name="description"
          id="description"
          defaultValue={book.description}
          className="w-full border rounded p-2"
        />
      </div>

      <div className="flex justify-end gap-2">
        <a
          href="/dashboard"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          Annuleren
        </a>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Opslaan
        </button>
      </div>
    </form>
  );
}
