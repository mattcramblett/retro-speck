"use client";
import { createCard } from "@/lib/server-actions/card-actions";
import { Card } from "@/types/model";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export function useCreateCard(options?: UseMutationOptions<Card, Error, number>) {
  return useMutation({
    ...(options || {}),
    mutationKey: ["cards", "create"],
    mutationFn: (columnId: number) => createCard(columnId),
  });
}

