export function MonthSelector({ selectedMonth, onChange }: {selectedMonth: number, onChange: (month: number) => void}) {
  const monthNames = [
    'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
    'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
  ];

  return (
    <div className="mb-4">
      <label className="text-sm font-medium text-gray-700 mr-2">Maand:</label>
      <select
        value={selectedMonth}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border rounded px-2 py-1"
      >
        {monthNames.map((name, index) => (
          <option key={index} value={index}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
