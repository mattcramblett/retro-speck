"use client";
import {
  getCard,
  getCards,
  createCard,
  updateCard,
} from "@/lib/server-actions/card-actions";
import { useRef } from "react";
import { debounce } from "throttle-debounce";
import { Card } from "@/types/model";
import {
  queryOptions,
  useQuery,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

// Query for all cards
export type CardsDeps = {
  retroId: number;
  initialData?: Card[];
};

export const cardsQuery = ({ retroId, initialData }: CardsDeps) =>
  queryOptions({
    queryKey: ["retro", retroId, "cards"],
    queryFn: () => getCards(retroId),
    initialData,
  });

// Aggregate hook for Retro Cards
export const useRetroCards = ({ retroId, initialData }: CardsDeps) => {
  const queryClient = useQueryClient();
  const queryOpts = cardsQuery({ retroId, initialData });

  // Main query - all cards
  const useCards = (opts?: Partial<typeof cardsQuery>) =>
    useQuery({ ...queryOpts, ...(opts || {}) });

  // Indiviudal query - specific card
  const useCard = (cardId: number) =>
    useQuery({
      ...queryOpts,
      select: (cards) => cards.find((c) => c.id === cardId), // filter down to specific card
    });

  // Side-effects - mutation results hook into the main query
  const handleCreateCard = (data: Card) =>
    queryClient.setQueryData(queryOpts.queryKey, (prev: Card[] | undefined) => [
      data,
      ...(prev || []),
    ]);

  const handleRefreshCard = (data: Card) => {
    queryClient.setQueryData(queryOpts.queryKey, (prev: Card[] | undefined) => {
      if (prev === undefined) return prev;
      const cardId = data.id;

      const isNew = prev?.findIndex((c) => c.id === cardId) === -1;
      if (isNew) {
        return [...(prev || []), data];
      }

      const result = prev?.map((c) => (c.id === cardId ? data : c));
      return result;
    });
  };

  // Mutations
  const useRefreshCard = (options?: UseMutationOptions<Card, Error, number>) =>{
    return useMutation({
      ...(options || {}),
      mutationKey: ["cards", "update"],
      mutationFn: (cardId: number) => getCard(cardId),
      onSuccess: handleRefreshCard,
    });
  }

  const useCreateCard = (options?: UseMutationOptions<Card, Error, number>) => {
    return useMutation({
      ...(options || {}),
      mutationKey: ["cards", "create"],
      mutationFn: (columnId: number) => createCard(columnId),
      onSuccess: handleCreateCard,
    });
  };

  const debouncedUpdate = useRef(
    debounce(1000, async (c: Card) => await updateCard(c)),
  );

  const useUpdateCard = (cardId: number) => {
    return useMutation({
      mutationKey: ["cards", cardId, "update"],
      mutationFn: async (card: Partial<Card>) => debouncedUpdate.current(card),
    });
  };

  return {
    useCards,
    useCard,
    useCreateCard,
    useUpdateCard,
    useRefreshCard,
  };
};
