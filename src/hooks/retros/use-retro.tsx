"use client";
import { getRetro } from "@/lib/server-actions/retro-actions";
import { queryOptions, useQuery } from "@tanstack/react-query";

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
