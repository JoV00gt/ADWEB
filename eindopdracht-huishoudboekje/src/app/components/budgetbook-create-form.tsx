'use client';

import { useState } from 'react';
import { createBudgetBook } from '../lib/actions/budgetbook-actions';
import MultiSelect from './select';
import { useParticipants } from '../lib/hooks/useParticipants';
import ErrorMessage from './error';

export default function BudgetBookForm() {
  const [error, setError] = useState('');
  const {
    currentUserId,
    filteredUsers,
    selectedUserIds,
    setSelectedUserIds,
  } = useParticipants();

  const handleSubmit = async (formData: FormData) => {
    try {
      setError('');
      await createBudgetBook(formData, currentUserId);
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis.');
    }
  };

  return (
    <form
      action={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4"
    >
      <ErrorMessage message={error} />

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

      <div>
        <MultiSelect
          options={filteredUsers.map(u => ({ label: u.email, value: u.id }))}
          selectedValues={selectedUserIds}
          onChange={setSelectedUserIds}
          name="participantIds"
          label="Deelnemers"
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
