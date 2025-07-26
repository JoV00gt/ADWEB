import { BudgetBookTable } from '../components/budgetbook-table';

export default function DashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Huishoudboekje</h2>
      <BudgetBookTable />
    </div>
  );
}