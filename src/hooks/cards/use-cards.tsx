"use client";
import { getCards } from "@/lib/server-actions/card-actions";
import { Card } from "@/types/model";
import { queryOptions, useQuery } from "@tanstack/react-query";

export type CardsQueryDeps = {
  retroId: number;
  initialData?: Card[];
};

export const cardsQuery = ({ retroId, initialData }: CardsQueryDeps) =>
  queryOptions({
    queryKey: ["retro", retroId, "cards"],
    queryFn: () => getCards(retroId),
    initialData,
  });

