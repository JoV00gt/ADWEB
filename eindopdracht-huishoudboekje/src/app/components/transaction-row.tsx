export default function TransactionRow({
  index,
  transaction,
  onChange,
  onDelete,
  canDelete,
}: {
  index: number;
  transaction: { amount: string; type: string; date: Date };
  onChange: (index: number, field: 'amount' | 'type', value: string) => void;
  onDelete: (index: number) => void;
  canDelete: boolean;
}) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <input
        type="number"
        placeholder="Bedrag"
        className="border p-2 rounded w-1/3"
        value={transaction.amount}
        onChange={e => onChange(index, 'amount', e.target.value)}
        required
      />

      <select
        className="border p-2 rounded w-1/3"
        value={transaction.type}
        onChange={e => onChange(index, 'type', e.target.value)}
      >
        <option value="uitgave">Uitgave</option>
        <option value="inkomen">Inkomen</option>
      </select>

      <input
        type="text"
        disabled
        value={transaction.date.toLocaleDateString()}
        className="border p-2 rounded w-1/3 bg-gray-100 text-gray-600"
      />

      <div className="w-6 text-center">
        {canDelete ? (
          <button
            onClick={() => onDelete(index)}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            X
          </button>
        ) : (
          <span>&nbsp;</span>
        )}
      </div>
    </div>
  );
}
