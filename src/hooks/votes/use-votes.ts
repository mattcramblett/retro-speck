"use client"
import { getVotes } from "@/lib/server-actions/vote-actions";
import { queryOptions, useQuery } from "@tanstack/react-query";

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
