"use client";
import { updateCard } from "@/lib/server-actions/card-actions";
import { Card } from "@/types/model";
import { useMutation } from "@tanstack/react-query";

export function useUpdateCard(cardId: number) {
  return useMutation({
    mutationKey: ["cards", cardId, "update"],
    mutationFn: (card: Partial<Card>) => updateCard(card),
  });
}

