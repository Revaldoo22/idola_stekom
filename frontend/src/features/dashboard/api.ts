import { api } from "@/lib/api-client";

export interface AdminStats {
  totalSchools: number;
  totalParticipants: number;
  totalVoters: number;
  totalVotes: number;
  totalPoints: number;
}

export const fetchStats = () => api<AdminStats>("/admin/stats");
