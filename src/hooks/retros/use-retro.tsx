import { getRetro } from "@/lib/server-actions/retro-actions";
import { useQuery, queryOptions  } from "@tanstack/react-query";

export function retroOptions(publicId: string) {
  return queryOptions({
    queryKey: ["retro", publicId],
    queryFn: () => getRetro(publicId),
  });
}

export function useRetro(publicId: string) {
  return useQuery(retroOptions(publicId));
}

