import BudgetBookForm from "@/app/components/budgetbook-create-form";

export default function CreateBudgetBookPage() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Nieuw Huishoudboekje</h1>
      <BudgetBookForm />
    </div>
  );
}