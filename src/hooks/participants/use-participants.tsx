"use client";
import { getParticipants } from "@/lib/server-actions/participants-actions";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useUser } from "../auth/use-user";
import { Participant } from "@/types/model";

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
