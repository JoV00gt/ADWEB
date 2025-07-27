import type { BudgetBook } from '../lib/definitions'; 

export function BudgetBookTable({ budgetBooks }: { budgetBooks: BudgetBook[] }) {
  return (
  <div>
    <table className="min-w-full bg-white shadow-md rounded-xl border-separate border-spacing-y-2">
      <thead className="bg-blue-100 text-blue-800">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-bold uppercase">Naam</th>
          <th className="px-6 py-3 text-left text-sm font-bold uppercase">Omschrijving</th>
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
          </tr>
        ))}

        {budgetBooks.length === 0 && (
          <tr>
            <td colSpan={2} className="text-center text-gray-400 py-6 italic">
              Geen huishoudboekjes gevonden.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>

  );
}