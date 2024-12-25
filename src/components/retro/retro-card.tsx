"use client";
import { DynamicTextarea } from "@/components/ui/dynamic-textarea";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { useParticipants } from "@/hooks/participants/use-participants";
import { Card } from "@/types/model";
import { useState, useEffect } from "react";

export function RetroCard({
  retroId,
  initialCard,
  editingEnabled,
}: {
  retroId: number;
  initialCard: Card;
  editingEnabled?: boolean;
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

  return (
    <DynamicTextarea
      value={content}
      onChange={(e) => handleUpdate(e.target.value || "")}
      disabled={participant?.id !== card?.participantId || !editingEnabled}
    />
  );
}
