"use client";
import { DynamicTextarea } from "@/components/ui/dynamic-textarea";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { Card } from "@/types/model";
import { useState, useEffect } from "react";

export function RetroCard({
  retroId,
  initialCard,
}: {
  retroId: number;
  initialCard: Card;
}) {
  const { useUpdateCard, useCard } = useRetroCards({ retroId });
  const { data: card } = useCard(initialCard.id);
  const { mutate: updateCard } = useUpdateCard(initialCard.id);

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
    />
  );
}
