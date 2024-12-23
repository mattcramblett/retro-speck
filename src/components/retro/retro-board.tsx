"use client";

import { Card, Column, Participant, Retro } from "@/types/model";
import { RetroCard } from "./retro-card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";

export function RetroBoard({
  initialRetro,
  initialColumns,
  initialCards,
  initialParticipants,
}: {
  initialRetro: Retro;
  initialColumns: Column[];
  initialCards: Card[];
  initialParticipants: Participant[];
}) {
  const retroId = initialRetro.id;
  const { useCards, useCreateCard } = useRetroCards({
    retroId,
    initialData: initialCards,
  });
  const { data: cards } = useCards();
  const { mutate: createCard, isPending: isCreateCardPending } =
    useCreateCard();

  return (
    <div className="flex h-full p-4 gap-4 max-h-full overflow-x-auto tiny-scrollbar overscroll-x-none">
      {initialColumns.map((column) => (
        <div key={column.id} className="flex flex-col items-center gap-4">
          <div className="flex min-h-8 w-full items-start px-2 overflow-x-scroll">
            <h2 className="font-black text-xl">{column.name}</h2>
          </div>
          <div
            key={column.id}
            className="flex flex-col max-h-full overflow-y-scroll tiny-scrollbar bg-card items-center gap-4 py-4 px-3 border border-primary/10 rounded-lg min-w-80 max-w-80"
          >
            <Button
              variant="outline"
              className="w-full min-h-10"
              onClick={() => createCard(column.id)}
              disabled={isCreateCardPending}
            >
              <Plus />
            </Button>
            {cards
              ?.filter((c) => c.retroColumnId === column.id)
              .sort((a, b) => b.id - a.id) // sort for consistency
              .map((card) => (
                <RetroCard key={card.id} retroId={retroId} initialCard={card} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
