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

// Query for individual card
export type CardDeps = {
  retroId: number;
  cardId: number;
  initialData?: Card;
};

export const cardQuery = ({ retroId, cardId, initialData }: CardDeps) =>
  queryOptions({
    queryKey: ["retro", retroId, "cards", cardId],
    queryFn: () => getCard(cardId),
    initialData,
  });

// Aggregate hook for Retro Cards
export const useRetroCards = ({ retroId, initialData }: CardsDeps) => {
  const queryClient = useQueryClient();
  const queryOpts = cardsQuery({ retroId, initialData });

  // Main query - all cards
  const useCards = () => useQuery(queryOpts);

  // Individual query - single card
  const useCard = (deps: CardDeps) => useQuery(cardQuery(deps));

  // Side-effects - mutation results hook into the main query
  const handleCreateCard = (data: Card) =>
    queryClient.setQueryData(queryOpts.queryKey, (prev: Card[] | undefined) => [
      data,
      ...(prev || []),
    ]);

  // Mutations
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
      mutationFn: async (card: Card) => {
        // Ensure local state of query is updated
        queryClient.setQueryData(
          cardQuery({ cardId: card.id, retroId }).queryKey,
          card,
        );
        return card;
      },
      onSuccess: (card) => {
        // Debounce updates to the server
        debouncedUpdate.current(card);
      }
    });
  };

  return {
    useCards,
    useCard,
    useCreateCard,
    useUpdateCard,
  };
};
