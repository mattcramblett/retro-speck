import { getRetroHistory } from "@/lib/server-actions/retro-actions";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type RetroHistoryParams = {
  pageIndex: number;
  resultsPerPage?: number;
};

export const retroHistoryQuery = ({
  pageIndex,
  resultsPerPage,
}: RetroHistoryParams) =>
  queryOptions({
    queryKey: ["retroHistory", pageIndex, resultsPerPage],
    queryFn: () => getRetroHistory(pageIndex, resultsPerPage || 5),
  });

export function useRetroHistory({
  pageIndex,
  resultsPerPage,
  options,
}: RetroHistoryParams & {
  options?: Partial<ReturnType<typeof retroHistoryQuery>>;
}) {
  return useQuery(
    retroHistoryQuery({ pageIndex, resultsPerPage, ...(options || {}) }),
  );
}
