import { api } from "@/lib/api-client";

export interface Participant {
  id: string;
  name: string;
  schoolId: string | null;
  schoolName: string | null;
  phoneNumber: string | null;
  description: string | null;
  totalPoints: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface School {
  id: string;
  name: string;
}

export interface ParticipantPayload {
  name: string;
  schoolId?: string;
  schoolName?: string;
  phoneNumber?: string;
  description?: string;
  status?: "active" | "inactive";
}

export const fetchParticipants = () => api<Participant[]>("/participants");
export const fetchSchools = () => api<School[]>("/schools");

export const createParticipant = (payload: ParticipantPayload) =>
  api<Participant>("/participants", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateParticipant = (id: string, payload: ParticipantPayload) =>
  api<Participant>(`/participants/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const deleteParticipant = (id: string) =>
  api<{ ok: boolean }>(`/participants/${id}`, { method: "DELETE" });
