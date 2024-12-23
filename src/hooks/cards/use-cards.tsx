"use client"
import { getCards } from "@/lib/server-actions/card-actions";
import { Card } from "@/types/model";
import { useQuery } from "@tanstack/react-query";

export function useCards({
  retroId,
  initialData
}: {
  retroId: number,
  initialData: Card[],
}) {
  return useQuery({
    queryKey: ["retro", retroId, "cards"],
    queryFn: () => getCards(retroId),
    initialData,
  });
}

