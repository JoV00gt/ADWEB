import Link from 'next/link';
import type { BudgetBook } from '../lib/definitions';
import { archiveBudgetBook } from '../lib/actions/budgetbook-actions';

export function BudgetBookTable({ budgetBooks, isArchived }: { budgetBooks: BudgetBook[], isArchived: boolean }) {
  return (
    <div>
      <table className="min-w-full bg-white shadow-md rounded-xl border-separate border-spacing-y-2">
        <thead className="bg-blue-100 text-blue-800">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase">Naam</th>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase">Omschrijving</th>
            <th className="px-6 py-3 text-left text-sm font-bold uppercase">Acties</th>
          </tr>
        </thead>
        <tbody>
          {budgetBooks.map((book) => (
            <tr
              key={book.id}
              className="bg-white hover:bg-blue-50 transition rounded-md shadow-sm"
            >
              <td className="px-6 py-4 text-gray-800">{book.name}</td>
              <td className="px-6 py-4 text-gray-600">{book.description}</td>
              <td className="px-6 py-4 text-blue-600">
  <div className="flex items-center space-x-4">
    {!isArchived && (
      <Link
        href={`/dashboard/${book.id}/edit`}
        className="text-blue-600 hover:text-blue-800 font-medium underline"
      >
        Bewerk
      </Link>
    )}
    <button
      className="text-red-500 hover:text-red-700 font-medium underline"
      onClick={() => archiveBudgetBook(book.id, !book.archived)}
    >
      {book.archived ? 'Dearchiveren' : 'Archiveren'}
    </button>
  </div>
</td>

            </tr>
          ))}

          {budgetBooks.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center text-gray-400 py-6 italic">
                Geen huishoudboekjes gevonden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
