"use client";
import { MutationOptions, queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { loginWithOtp } from "@/lib/server-actions/authN-actions";

export const userQuery = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClientComponentClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw "unauthenticated";
      return user;
    },
    retry: 1,
  });

export function useUser(opts?: Partial<ReturnType<typeof userQuery>>) {
  return useQuery({
    ...userQuery(),
    ...(opts || {}),
  });
}

export function useSendOtp(opts?: MutationOptions<void, Error, string>) {
  return useMutation({
    mutationKey: ["user", "sendOtp"],
    mutationFn: (email: string) => loginWithOtp(email),
    ...(opts || {}),
  });
}

export function useSignOut(opts?: MutationOptions) {
  return useMutation({
    mutationKey: ["user", "signout"],
    mutationFn: () => createClientComponentClient().auth.signOut(),
    ...(opts || {}),
  });
}
