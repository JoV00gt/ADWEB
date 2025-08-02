'use client'

import { useEffect, useState } from "react";
import { createBudgetBook } from "../lib/actions/budgetbook-actions";
import { getUserId } from "../lib/actions/auth-actions";
import { User } from "../lib/definitions";
import { listenToUsers } from "../lib/listeners/user-listener";
import MultiSelect from "./select";

export default function BudgetBookForm() {
  const [error, setError] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserId() {
      const id = await getUserId();
      setCurrentUserId(id);
    }
    fetchUserId();
  
  const unsubscribe = listenToUsers(setUsers);
  return () => unsubscribe();
  }, []);

  const filteredUsers = currentUserId ? users.filter(u => u.id !== currentUserId) : users;

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

      <div>
      <MultiSelect
        options={filteredUsers.map((u) => ({ label: u.email, value: u.id }))}
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
