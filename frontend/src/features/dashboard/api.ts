import { api } from "@/lib/api-client";

export interface AdminStats {
  totalSchools: number;
  totalParticipants: number;
  totalVoters: number;
  totalVotes: number;
  totalPoints: number;
}

export interface VoteSeriesPoint {
  day: string; // YYYY-MM-DD
  votes: number;
}

export const fetchStats = () => api<AdminStats>("/admin/stats");

export const fetchVoteSeries = (days: number) =>
  api<VoteSeriesPoint[]>(`/admin/vote-series?days=${days}`);
