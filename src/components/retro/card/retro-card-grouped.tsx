"use client";
import { DynamicTextarea } from "@/components/ui/dynamic-textarea";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { useParticipants } from "@/hooks/participants/use-participants";
import { Card } from "@/types/model";
import { useState, useEffect } from "react";

// TODO: implement grouping
export function RetroCardGrouped({
  retroId,
  initialCard,
  isDraftState,
}: {
  retroId: number;
  initialCard: Card;
  isDraftState?: boolean;
}) {
  const { useUpdateCard, useCard } = useRetroCards({ retroId });
  const { data: card } = useCard(initialCard.id);
  const { mutate: updateCard } = useUpdateCard(initialCard.id);

  const { useCurrentParticipant } = useParticipants({ retroId });
  const { data: participant } = useCurrentParticipant();

  // Keep content tracked local to the component for text editing, but update it if the source changes.
  const [content, setContent] = useState(initialCard.content);
  useEffect(() => setContent(card?.content || ""), [card?.content]);

  const handleUpdate = (updatedContent: string) => {
    const content = updatedContent.replaceAll(/<|>/g, "");
    setContent(content);
    updateCard({ ...(card || initialCard), content });
  };

  const participantOwnsCard = card?.participantId === participant?.id;

  return (
    <DynamicTextarea
      value={content}
      onChange={(e) => handleUpdate(e.target.value || "")}
      disabled={!isDraftState || !participantOwnsCard}
      obfuscate={isDraftState && !participantOwnsCard}
    />
  );
}
