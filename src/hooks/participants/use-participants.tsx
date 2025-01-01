"use client";
import {
  getParticipant,
  getParticipants,
  updateParticipant,
} from "@/lib/server-actions/participants-actions";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useUser } from "../auth/use-user";
import { Participant } from "@/types/model";
import { useRouter } from "next/navigation";

export const participantsQuery = (retroId: number) =>
  queryOptions({
    queryKey: ["retro", retroId, "participants"],
    queryFn: () => getParticipants(retroId),
  });

export const useParticipants = (
  retroId: number,
  opts?: Partial<ReturnType<typeof participantsQuery>>,
) => useQuery({ ...participantsQuery(retroId), ...(opts || {}) });

export const useCurrentParticipant = (retroId: number) => {
  const { data: user } = useUser();
  return useQuery({
    ...participantsQuery(retroId),
    select: (participants) =>
      participants.find((p: Participant) => p.userId === user?.id),
  });
};

export const useUpdateParticipant = () => {
  return useMutation({
    mutationKey: ["participant", "updateAdmission"],
    mutationFn: async (participant: Partial<Participant>) =>
      await updateParticipant(participant),
  });
};

export const useRefreshParticipant = (retroId: number) => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const router = useRouter();

  return useMutation({
    mutationKey: ["participant", "refresh"],
    mutationFn: async (participantId: number) =>
      await getParticipant(participantId),
    onSuccess: (participant: Participant) => {
      if (participant.userId === user?.id) {
        // Current participant was updated, reload page
        router.refresh();
      }
      // Insert the refreshed participant into local state
      queryClient.setQueryData(
        participantsQuery(retroId).queryKey,
        (prev?: Participant[]) => {
          if (!prev) return;

          return prev.map((p) => (p.id === participant.id ? participant : p));
        },
      );
    },
  });
};
