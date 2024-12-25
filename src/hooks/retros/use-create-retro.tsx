"use client"

import { createRetro } from "@/lib/server-actions/retro-actions";
import { MutationOptions, useMutation } from "@tanstack/react-query"

export function useCreateRetro(mutationOptions: MutationOptions<string, Error, string>) {
  return useMutation({
    ...mutationOptions,
    mutationKey: ["retro", "create"],
    mutationFn: (name: string) => createRetro(name),
  });
}
