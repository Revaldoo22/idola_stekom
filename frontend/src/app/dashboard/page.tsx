import { AdminShell } from "@/components/admin-shell";
import { StatsCards } from "@/features/dashboard/components/stats-cards";
import { VoteChart } from "@/features/dashboard/components/vote-chart";

export default function DashboardPage() {
  return (
    <AdminShell title="Dashboard Admin">
      <StatsCards />
      <VoteChart days={14} />
    </AdminShell>
  );
}
