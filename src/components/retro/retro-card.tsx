"use client";
import { DynamicTextarea } from "@/components/ui/dynamic-textarea";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { Card } from "@/types/model";
import { useState, useEffect } from "react";

// The useState/useEffect combo for `content` is to prevent the textarea cursor from jumping as a user types.
// The useMutation update lifecycle is somehow slightly out of sync with DOM rendering, probably because it's
// expected to be async. This just keeps the data stable with rendering cycles but also fresh.
export function RetroCard({ retroId, initialCard }: { retroId: number, initialCard: Card }) {
  const { useUpdateCard, useCard } = useRetroCards({ retroId });
  const { data: card } = useCard({ retroId, cardId: initialCard.id, initialData: initialCard });
  const { mutate } = useUpdateCard(initialCard.id);

  const [content, setContent] = useState(initialCard.content);
  useEffect(() => setContent(card?.content || ""), [card?.content]);

  const handleUpdate = (updatedContent: string) => {
    setContent(updatedContent);
    mutate({ ...(card || initialCard), content: updatedContent });
  };

  return (
    <DynamicTextarea
      value={content}
      onChange={(e) => handleUpdate(e.target.value || "")}
    />
  );
}
