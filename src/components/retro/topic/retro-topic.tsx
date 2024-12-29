"use client";

import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { useTopic } from "@/hooks/topics/use-topics";
import { Card } from "@/types/model";
import { RetroCardGrouped } from "../card/retro-card-grouped";
import { cn } from "@/lib/utils";

export function RetroTopic({
  retroId,
  topicId,
}: {
  retroId: number;
  topicId: number;
}) {
  const { data: topic } = useTopic(retroId, topicId);
  const { useCards } = useRetroCards({ retroId });
  const { data: cards } = useCards({
    select: (allCards: Card[]) =>
      allCards.filter((c: Card) => c.topicId === topicId),
  });

  const multipleCards = (cards?.length || 0) > 1;
  
  if (cards?.length === 0) {
    return null;
  }

  return (
    <div className="w-full" key={topicId}>
      {multipleCards && (
        <div className="font-bold text-md pb-1">{topic?.name}</div>
      )}
      <div
        className={cn(
          "flex flex-col w-full gap-2 m-0",
          multipleCards ? "pl-2 border-l-2 border-primary rounded-lg" : null,
        )}
      >
        {cards?.map((card) => (
          <RetroCardGrouped
            key={card.id}
            retroId={retroId}
            topicId={topicId}
            cardId={card.id}
          />
        ))}
      </div>
    </div>
  );
}
