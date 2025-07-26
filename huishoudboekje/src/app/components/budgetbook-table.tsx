export function BudgetBookTable() {
    return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
        <h2 className="text-2xl font-bold mb-4">Mijn Huishoudboekjes</h2>
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Naam</th>
                <th className="px-6 py-3 text-sm font-semibold text-gray-600">Omschrijving</th>
              </tr>
            </thead>
            <tbody>
              
            </tbody>
          </table>
        </div>
      </div>
    );
}