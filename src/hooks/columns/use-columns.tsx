"use client";

import { getColumns } from "@/lib/server-actions/column-actions";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const columnsQuery = (retroId: number) =>
  queryOptions({
    queryKey: ["retro", retroId, "columns"],
    queryFn: () => getColumns(retroId),
  });

export function useColumn(
  retroId: number,
  columnId: number,
) {
  return useQuery({
    ...columnsQuery(retroId),
    select: (cols) => cols.find(c => c.id === columnId),
  });
}

export function useColumns(
  retroId: number,
  options?: Partial<ReturnType<typeof columnsQuery>>,
) {
  return useQuery({
    ...options,
    ...columnsQuery(retroId),
  });
}
