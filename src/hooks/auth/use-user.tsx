"use client";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const userQuery = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClientComponentClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });

export function useUser(opts?: Partial<ReturnType<typeof userQuery>>) {
  return useQuery({
    ...userQuery(),
    ...(opts || {}),
  });
}
