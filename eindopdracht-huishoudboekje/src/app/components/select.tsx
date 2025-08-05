'use client';

import React from 'react';
export default function MultiSelect({options, selectedValues, onChange, name = 'participantIds', label = 'Selecteer deelnemers',}: {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  name?: string;
  label?: string;
}) {

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    onChange(selected);
  };

  return (
    <div className="mb-4">
      {label && <label className="block font-medium mb-1">{label}</label>}
      <select
        multiple
        value={selectedValues}
        onChange={handleChange}
        className="w-full border rounded-md p-2 h-32 bg-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {selectedValues.map((val) => (
        <input key={val} type="hidden" name={name} value={val} />
      ))}
    </div>
  );
}
