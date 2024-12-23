"use client";
import { getCards, createCard, updateCard } from "@/lib/server-actions/card-actions";
import { Card } from "@/types/model";
import { queryOptions, useQuery, useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";

export type CardsDeps = {
  retroId: number;
  initialData?: Card[];
};

// Reusable query options for the useQuery hook
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

  // Main query
  const useCards = () => useQuery(queryOpts);

  // Side-effects - mutation results hook into the main query
  const handleCreateCard = (data: Card) =>
    queryClient.setQueryData(
      queryOpts.queryKey,
      (prev: Card[] | undefined) => [data, ...(prev || [])],
    );

  // Mutations
  const useCreateCard = (options?: UseMutationOptions<Card, Error, number>) => {
    return useMutation({
      ...(options || {}),
      mutationKey: ["cards", "create"],
      mutationFn: (columnId: number) => createCard(columnId), 
      onSuccess: handleCreateCard ,
    });
  }

  const useUpdateCard = (cardId: number) => {
    return useMutation({
      mutationKey: ["cards", cardId, "update"],
      mutationFn: (card: Partial<Card>) => updateCard(card),
    });
  }

  return {
    useCards,
    useCreateCard,
    useUpdateCard,
  };
}

