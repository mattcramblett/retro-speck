"use client";

import { Card, Column, getPhase, Retro } from "@/types/model";
import { RetroCardDraft } from "@/components/retro/card/retro-card-draft";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { useRetro } from "@/hooks/retros/use-retro";
import { RetroColumn } from "@/components/retro/retro-column";
import { CreateCardButton } from "@/components/retro/create-card-button";
import { RetroCardGrouped } from "@/components/retro/card/retro-card-grouped";

export function ColumnBoard({
  initialRetro,
  initialColumns,
  initialCards,
}: {
  initialRetro: Retro;
  initialColumns: Column[];
  initialCards: Card[];
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
    <>
      {initialColumns.map((column) => (
        <RetroColumn key={column.id} name={column.name}>
          {phase.name === "brainstorm" && (
            <CreateCardButton
              onClick={() => createCard(column.id)}
              disabled={isCreateCardPending}
            />
          )}
          {cards
            ?.filter((c) => c.retroColumnId === column.id)
            .sort((a, b) => b.id - a.id) // sort for consistency
            .map((card) => {
              if (phase.isDraftState) {
                return (
                  <RetroCardDraft
                    key={card.id}
                    retroId={retroId}
                    initialCard={card}
                    isDraftState={phase.isDraftState}
                  />
                );
              }
              return (
                <RetroCardGrouped
                  key={card.id}
                  retroId={retroId}
                  initialCard={card}
                  isDraftState={phase.isDraftState}
                />
              );
            })}
        </RetroColumn>
      ))}
    </>
  );
}
