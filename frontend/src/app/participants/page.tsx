import { AdminShell } from "@/components/admin-shell";
import { ParticipantsTable } from "@/features/participants/components/participants-table";

export default function ParticipantsPage() {
  return (
    <AdminShell title="Peserta">
      <ParticipantsTable />
    </AdminShell>
  );
}
