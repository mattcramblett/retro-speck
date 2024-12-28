"use client";
import { advancePhase, getRetro } from "@/lib/server-actions/retro-actions";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";

export const retroQuery = (retroId: number) =>
  queryOptions({
    queryKey: ["retro", retroId],
    queryFn: () => getRetro(retroId),
  });

export const useRetro = (
  retroId: number,
  options?: Partial<typeof retroQuery>,
) => {
  return useQuery({
    ...(options || {}),
    ...retroQuery(retroId),
  });
};

export const useAdvancePhase = (retroId: number) => {
  return useMutation({
    mutationKey: ["retro", "advancePhase"],
    mutationFn: () => advancePhase(retroId),
  });
}
