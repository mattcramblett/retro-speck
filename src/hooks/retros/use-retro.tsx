"use client";
import { advancePhase, getRetro } from "@/lib/server-actions/retro-actions";
import { MutateOptions, queryOptions, useMutation, useQuery } from "@tanstack/react-query";

export const retroQuery = (retroId: number) =>
  queryOptions({
    queryKey: ["retro", retroId],
    queryFn: () => getRetro(retroId),
  });

export const useRetro = (
  retroId: number,
  options?: Partial<ReturnType<typeof retroQuery>>,
) => {
  return useQuery({
    ...(options || {}),
    ...retroQuery(retroId),
  });
};

export const useAdvancePhase = (retroId: number, opts?: MutateOptions) => {
  return useMutation({
    mutationKey: ["retro", "advancePhase"],
    mutationFn: () => advancePhase(retroId),
    ...(opts || {}),
  });
}
