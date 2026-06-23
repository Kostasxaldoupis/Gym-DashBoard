import PlanForm from "../../../components/PlanForm";

export default function NewPlanPage() {
  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <PlanForm mode="create" />
    </main>
  );
}