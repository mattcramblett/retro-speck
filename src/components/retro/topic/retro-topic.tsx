"use client";

import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { useTopic } from "@/hooks/topics/use-topics";
import { Card } from "@/types/model";
import { RetroCardGrouped } from "../card/retro-card-grouped";

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

  return (
    <div className="w-full" key={topicId}>
      { (cards?.length || 0) > 1 && <div className="font-bold text-xl">{topic?.name}</div> }
      {cards?.map((card) => (
        <RetroCardGrouped key={card.id} retroId={retroId} cardId={card.id} />
      ))}
    </div>
  );
}
