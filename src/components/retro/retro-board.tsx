"use client";

import { Card, Column, Participant, Retro } from "@/types/model";
import { RetroCard } from "./retro-card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { useRetro } from "@/hooks/retros/use-retro";
import { RetroColumn } from "./retro-column";

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
  const { data: retro } = useRetro(retroId, { initialData: initialRetro });

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
        <RetroColumn key={column.id} name={column.name}>
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
        </RetroColumn>
      ))}
    </div>
  );
}
