"use client";
import { getTopics } from "@/lib/server-actions/topic-actions";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const topicsQuery = (retroId: number) =>
  queryOptions({
    queryKey: ["retro", retroId, "topics"],
    queryFn: () => getTopics(retroId),
  });

export const useTopics = (
  retroId: number,
  options: Partial<ReturnType<typeof topicsQuery>>,
) => {
  return useQuery({
    ...topicsQuery(retroId),
    ...options,
  });
};
