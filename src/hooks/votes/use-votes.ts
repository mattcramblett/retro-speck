"use client"
import { createVote, getVotes } from "@/lib/server-actions/vote-actions";
import { Vote } from "@/types/model";
import { queryOptions, useMutation, UseMutationOptions, useQuery } from "@tanstack/react-query";

export const voteQuery = (retroId: number) =>
  queryOptions({
    queryKey: ["retro", retroId, "votes"],
    queryFn: () => getVotes(retroId),
  });

export function useVotes(
  retroId: number,
  opts?: Partial<ReturnType<typeof voteQuery>>,
) {
  return useQuery({
    ...(opts || {}),
    ...voteQuery(retroId),
  });
}

export const useCreateVote = (opts?: UseMutationOptions<Vote, Error, number>) => {
  return useMutation({
    mutationKey: ["vote", "create"],
    mutationFn: (topicId: number) => createVote(topicId),
    ...(opts || {}),
  });
}
