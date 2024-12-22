"use client"

import { createRetro } from "@/lib/server-actions/retro-actions";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export function useCreateRetro(options?: UseMutationOptions<string, Error, string>) {
  return useMutation({
    ...(options || {}),
    mutationKey: ["retros", "create"],
    mutationFn: async (retroTitle: string) => await createRetro(retroTitle),
  });
}
