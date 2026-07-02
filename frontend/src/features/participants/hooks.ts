import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  createParticipant,
  deleteParticipant,
  fetchParticipants,
  fetchSchools,
  updateParticipant,
  type ParticipantPayload,
} from "./api";

export function useParticipants() {
  return useQuery({
    queryKey: queryKeys.participants.list(),
    queryFn: fetchParticipants,
  });
}

export function useSchools() {
  return useQuery({
    queryKey: queryKeys.schools.list(),
    queryFn: fetchSchools,
  });
}

/** Invalidate everything a participant change can affect. */
function useInvalidateParticipants() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: queryKeys.participants.all });
    qc.invalidateQueries({ queryKey: queryKeys.schools.all });
    qc.invalidateQueries({ queryKey: queryKeys.admin.all });
  };
}

export function useCreateParticipant() {
  const invalidate = useInvalidateParticipants();
  return useMutation({
    mutationFn: createParticipant,
    onSuccess: invalidate,
  });
}

export function useUpdateParticipant() {
  const invalidate = useInvalidateParticipants();
  return useMutation({
    mutationFn: ({ id, ...payload }: ParticipantPayload & { id: string }) =>
      updateParticipant(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteParticipant() {
  const invalidate = useInvalidateParticipants();
  return useMutation({
    mutationFn: deleteParticipant,
    onSuccess: invalidate,
  });
}
