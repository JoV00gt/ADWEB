import { BudgetBookTable } from '../components/budgetbook-table';
import { useState } from 'react';

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);


  return (
    <div className="overflow-x-auto flex items-center justify-center min-h-screen">
      <div className="max-w-4xl w-full p-4 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-semibold mb-4 text-center">Huishoudboekjes App</h1>
        <BudgetBookTable />
      </div>
    </div>
  );
}