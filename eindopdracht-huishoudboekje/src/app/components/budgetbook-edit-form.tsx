'use client';

import { useEffect, useState } from 'react';
import { updateBudgetBook } from '../lib/actions/budgetbook-actions';
import { getUserId } from '../lib/actions/auth-actions';
import { listenToUsers } from '../lib/listeners/user-listener';
import type { BudgetBook, User } from '../lib/definitions';
import MultiSelect from './select';

export default function EditBudgetBookForm({ book }: { book: BudgetBook }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(book.participants || []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserId() {
      const id = await getUserId();
      setCurrentUserId(id);
    }
    fetchUserId();

    const unsubscribe = listenToUsers(setUsers);
    return () => unsubscribe();
  }, []);

  const filteredUsers = currentUserId 
    ? users.filter(user => user.id !== currentUserId) 
    : users;

  const handleSubmit = async (formData: FormData) => {
    try {
      setError(null);
      selectedUserIds.forEach(id => formData.append('participantIds', id));
      await updateBudgetBook(book.id, formData);
    } catch (err: any) {
      setError(err.message || 'Er ging iets mis.');
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      handleSubmit(formData);
    }} className="space-y-4 max-w-md mx-auto">
      {error && <p className="text-red-600">{error}</p>}

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

      <div>
        <MultiSelect
          options={filteredUsers.map(u => ({ label: u.email, value: u.id }))}
          selectedValues={selectedUserIds}
          onChange={setSelectedUserIds}
          name="participantIds"
          label="Deelnemers"
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
