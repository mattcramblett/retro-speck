"use client";

import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { useTopic } from "@/hooks/topics/use-topics";
import { Card } from "@/types/model";
import { RetroCardGrouped } from "../card/retro-card-grouped";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { TopicTitle } from "./topic-title";

export function RetroTopic({
  retroId,
  topicId,
}: {
  retroId: number;
  topicId: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

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
      {multipleCards && topic && (
        <TopicTitle
          topic={topic}
          onToggleExpand={() => setIsExpanded(it => !it)}
          isExpanded={isExpanded}
        />
      )}
      <div
        className={cn(
          "flex flex-col w-full m-0",
          multipleCards ? "pl-2 border-l-2 border-primary rounded-lg" : null,
          isExpanded ? "gap-2" : "gap-0.5",
        )}
      >
        {cards
          ?.sort(
            (a, b) =>
              new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
          )
          .map((card, idx) => {
            if (isExpanded || idx === 0) {
              return (
                <RetroCardGrouped
                  key={card.id}
                  retroId={retroId}
                  topicId={topicId}
                  cardId={card.id}
                />
              );
            } else {
              return (
                <div key={card.id} className="h-2 bg-primary/10 rounded-b-lg" />
              );
            }
          })}
      </div>
    </div>
  );
}
