import { BudgetBookTable } from '../components/budgetbook-table';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Huishoudboekje</h1>
      <BudgetBookTable />
    </div>
  );
}