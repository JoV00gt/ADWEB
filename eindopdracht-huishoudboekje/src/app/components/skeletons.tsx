const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function BudgetBookTableSkeleton() {
  return (
    <div className="overflow-x-auto relative">
      <div className="max-w-4xl mx-auto mt-10 p-4">
        <div className="mb-4 h-6 w-48 rounded bg-gray-200 relative overflow-hidden">
          <div className={shimmer}></div>
        </div>
        <div className="overflow-x-auto bg-white shadow rounded-xl relative">
          <table className="min-w-full table-auto border-separate border-spacing-y-2">
            <thead className="bg-blue-100 text-blue-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase">Naam</th>
                <th className="px-6 py-3 text-left text-sm font-bold uppercase">Omschrijving</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="bg-white rounded-md shadow-sm">
                  <td className="px-6 py-4">
                    <div className={`h-4 w-32 rounded bg-gray-200 relative overflow-hidden`}>
                      <div className={shimmer}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`h-4 w-48 rounded bg-gray-200 relative overflow-hidden`}>
                      <div className={shimmer}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function TransactionStatsSkeleton() {
  return (
    <div className="animate-pulse space-y-2 mb-4">
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-1/3" />
    </div>
  );
}

 export function TransactionListSkeleton() {
  return (
    <div className="space-y-4 mt-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse h-12 bg-gray-100 rounded" />
      ))}
    </div>
  );
}

