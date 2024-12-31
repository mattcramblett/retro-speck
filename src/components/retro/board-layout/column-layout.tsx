"use client";

import { Card, Column, getPhase, Retro } from "@/types/model";
import { RetroCardDraft } from "@/components/retro/card/retro-card-draft";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { useRetro } from "@/hooks/retros/use-retro";
import { RetroColumn } from "@/components/retro/retro-column";
import { CreateCardButton } from "@/components/retro/create-card-button";
import { useTopics } from "@/hooks/topics/use-topics";
import { RetroTopic } from "../topic/retro-topic";
import { Skeleton } from "@/components/ui/skeleton";
import { useColumns } from "@/hooks/columns/use-columns";

export function ColumnLayout({
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

  const { data: columns } = useColumns(retroId, {
    initialData: initialColumns,
  });

  const { useCards, useCreateCard } = useRetroCards({
    retroId,
    initialData: initialCards,
  });
  const { data: cards } = useCards();
  const { mutate: createCard, isPending: isCreateCardPending } =
    useCreateCard();

  const { data: topics, isPending: isPendingTopics } = useTopics(retroId, {
    enabled: phase.name === "grouping",
  });

  return (
    <div className="flex h-full p-4 gap-4 max-h-full overflow-x-auto tiny-scrollbar overscroll-x-none">
      {columns?.map((column) => (
        <RetroColumn
          key={column.id}
          name={column.name}
          showLabel={phase.isDraftState}
        >
          {phase.name === "brainstorm" && (
            <CreateCardButton
              onClick={() => createCard(column.id)}
              disabled={isCreateCardPending}
            />
          )}
          {phase.isDraftState &&
            cards
              ?.filter((c) => c.retroColumnId === column.id)
              .sort((a, b) => b.id - a.id) // sort for consistency
              .map((card) => {
                return (
                  <RetroCardDraft
                    key={card.id}
                    retroId={retroId}
                    initialCard={card}
                    isDraftState={phase.isDraftState}
                  />
                );
              })}
          {phase.name === "grouping" && isPendingTopics && (
            <Skeleton className="w-full h-96 rounded-lg" />
          )}
          {phase.name === "grouping" &&
            topics
              ?.filter((t) => t.retroColumnId === column.id)
              .sort((a, b) => b.id - a.id)
              .map((topic) => (
                <RetroTopic
                  key={topic.id}
                  retroId={retroId}
                  topicId={topic.id}
                />
              ))}
        </RetroColumn>
      ))}
    </div>
  );
}
