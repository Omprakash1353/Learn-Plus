import { Charts } from "./_components/charts/charts";

export default function DashboardPage() {
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="text-2xl">Dashboard</div>
          <Charts />
        </div>
      </div>
    </>
  );
}
