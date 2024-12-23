"use client";
import { DynamicTextarea } from "@/components/ui/dynamic-textarea";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { Card } from "@/types/model";
import { useState, useRef } from "react";
import { debounce } from "throttle-debounce";

export function RetroCard({ retroId, initialCard }: { retroId: number, initialCard: Card }) {
  const [card, setCard] = useState<Card>(initialCard);
  
  const { useUpdateCard } = useRetroCards({ retroId });
  const { mutateAsync } = useUpdateCard(card.id);

  const debouncedUpdate = useRef(
    debounce(1000, async (c: Partial<Card>) => setCard(await mutateAsync(c))),
  );
  // TODO: Should this just be a 'useCard' query with initialData?

  const handleUpdate = (content: string) => {
    // Not ideal to have a side-effect within a state setter callback
    setCard((c: Card) => {
      const updatedCard = { ...c, content };
      debouncedUpdate.current(updatedCard);
      return updatedCard;
    });
  };

  return (
    <DynamicTextarea
      value={card.content || ""}
      onChange={(e) => handleUpdate(e.target.value || "")}
    />
  );
}
