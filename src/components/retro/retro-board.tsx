"use client";

import {
  Card,
  Column,
  getPhase,
  Participant,
  PhaseName,
  phases,
  Retro,
} from "@/types/model";
import { RetroCard } from "./retro-card";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { useRetro } from "@/hooks/retros/use-retro";
import { RetroColumn } from "./retro-column";
import { CreateCardButton } from "./create-card-button";

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
  const phase = getPhase(retro?.phase);

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
          <CreateCardButton
            onClick={() => createCard(column.id)}
            disabled={isCreateCardPending}
          />
          {cards
            ?.filter((c) => c.retroColumnId === column.id)
            .sort((a, b) => b.id - a.id) // sort for consistency
            .map((card) => (
              <RetroCard
                key={card.id}
                retroId={retroId}
                initialCard={card}
                editingEnabled={phase.isDraftState}
              />
            ))}
        </RetroColumn>
      ))}
    </div>
  );
}
