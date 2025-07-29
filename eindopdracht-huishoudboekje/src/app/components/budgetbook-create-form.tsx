'use client'

import { useState } from "react";
import { createBudgetBook } from "../lib/actions/budgetbook-actions";

export default function BudgetBookForm() {
  const [error, setError] = useState(null);

  const handleSubmit = async (formData: FormData) => {
    try {
      setError(null);
      await createBudgetBook(formData);
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis.');
    }
  };
  
  return (
    <form
      action={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4"
    >
      {error && <p className="text-red-600">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Naam *</label>
        <input
          type="text"
          name="name"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Omschrijving</label>
        <textarea
          name="description"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Opslaan
      </button>
    </form>
  );
}
