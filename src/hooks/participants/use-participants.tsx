"use client";
import { getParticipants } from "@/lib/server-actions/participants-actions";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useUser } from "../auth/use-user";
import { Participant } from "@/types/model";

export function useParticipants({ retroId }: { retroId: number }) {
  const participantsQuery = queryOptions({
    queryKey: ["retro", retroId, "participants"],
    queryFn: () => getParticipants(retroId),
  });

  const useParticipants = () => useQuery(participantsQuery);

  const useCurrentParticipant = () => {
    const { data: user } = useUser();
    return useQuery({
      ...participantsQuery,
      select: (participants) =>
        participants.find((p: Participant) => p.userId === user?.id),
    });
  };

  return {
    useParticipants,
    useCurrentParticipant,
  };
}
