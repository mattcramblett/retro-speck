"use client";
import {
  getParticipant,
  getParticipants,
  updateParticipant,
} from "@/lib/server-actions/participants-actions";
import {
  MutateOptions,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useUser } from "../auth/use-user";
import { Participant } from "@/types/model";
import { useRouter } from "next/navigation";
import { useToast } from "../use-toast";

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

export const useUpdateParticipant = (
  opts?: MutateOptions<Participant, Error, Partial<Participant>>,
) => {
  return useMutation({
    mutationKey: ["participant", "updateAdmission"],
    mutationFn: async (participant: Partial<Participant>) =>
      await updateParticipant(participant),
    ...(opts || {}),
  });
};

export const useRefreshParticipant = (retroId: number) => {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

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

          const isNew = prev?.findIndex((p) => p.id === participant.id) === -1;
          if (isNew) {
            toast({
              title: `${participant.name} has joined!`,
            });
            return [...(prev || []), participant];
          }

          return prev.map((p) => (p.id === participant.id ? participant : p));
        },
      );
    },
  });
};
