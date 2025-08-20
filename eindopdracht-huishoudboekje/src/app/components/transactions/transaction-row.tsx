import { formatDate } from "@/app/lib/utils/format-date";

export default function TransactionRow({
  index,
  transaction,
  onChange,
  onDelete,
  canDelete,
  isEditing = false,
  categories
}: {
  index: number;
  transaction: { amount: string; type: string; date: Date, categoryId?: string; };
  onChange: (index: number, field: 'amount' | 'type' | 'date' | 'categoryId', value: string) => void;
  onDelete: (index: number) => void;
  canDelete: boolean;
  isEditing?: boolean;
  categories: {id: string, name: string}[];
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
        className="border p-2 rounded"
        value={transaction.type}
        onChange={e => onChange(index, 'type', e.target.value)}
      >
        <option value="uitgave">Uitgave</option>
        <option value="inkomen">Inkomen</option>
      </select>

      <input
        type="date"
        className="border p-2 rounded w-1/3"
        data-testid={`date-input-${index}`}
        value={formatDate(transaction.date)}
        onChange={e => onChange(index, 'date', e.target.value)}
        required
      />

      <select
        className="border p-2 rounded"
        value={transaction.categoryId || ''}
        onChange={e => onChange(index, 'categoryId', e.target.value)}
      >
        <option value="">Geen categorie</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

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
