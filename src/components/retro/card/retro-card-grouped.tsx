"use client";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { useRetro } from "@/hooks/retros/use-retro";
import { useColumn } from "@/hooks/columns/use-columns";
import { cn } from "@/lib/utils";
import { getPhase } from "@/types/model";
import { useState, DragEvent } from "react";
import { Badge } from "@/components/ui/badge";

export function RetroCardGrouped({
  retroId,
  topicId,
  cardId,
}: {
  retroId: number;
  topicId: number;
  cardId: number;
}) {
  const { useCard, useUpdateCard } = useRetroCards({ retroId });
  const { mutate: updateCard } = useUpdateCard();
  const { data: card } = useCard(cardId);
  const { data: column } = useColumn(retroId, card?.retroColumnId || 0);
  const { data: retro } = useRetro(retroId);
  const phase = getPhase(retro?.phase);
  const draggable = phase.name === "grouping";

  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpdate = (cardId: number) => {
    if (!cardId) return;
    updateCard({ id: cardId, topicId });
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("cardId", `${card?.id}`);
    setIsDragging(true);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    if (isDragging) {
      // don't drop the card into itself
      setIsDragOver(false);
      return;
    }
    // The card being dropped
    const cardId = Number(e.dataTransfer?.getData("cardId") || 0);
    if (!cardId || cardId === card?.id) {
      setIsDragOver(false);
      return;
    }
    setIsDragOver(false);
    handleUpdate(cardId); // Update the card to join this topic
  };

  return (
    <>
      <div
        className={cn(
          "w-full max-w-md font-medium text-sm bg-primary/10 hover:bg-primary/20 rounded-lg px-3 py-2 border border-secondary",
          draggable ? "cursor-grab" : null,
          "transition-all",
          isDragging ? "opacity-50 scale-95" : undefined,
          isDragOver && !isDragging ? "scale-110 shadow-lg" : null,
        )}
        draggable={draggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <p className="size-full text-wrap break-words select-none whitespace-pre-wrap">
          {card?.content}
        </p>
        <div className="w-full flex justify-end">
          <Badge>{column?.name}</Badge>
        </div>
      </div>
    </>
  );
}
