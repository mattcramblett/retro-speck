"use client";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";

export function RetroCardGrouped({
  retroId,
  cardId,
}: {
  retroId: number;
  cardId: number;
}) {
  const { useUpdateCard, useCard } = useRetroCards({ retroId });
  const { data: card } = useCard(cardId);
  const { mutate: updateCard } = useUpdateCard(cardId);

  const handleUpdate = () => {
    if (!card) return;
    updateCard({ ...card }); // NOTE: Set new topic here
  };

  return (
    <>
      <div className="w-full max-w-md font-medium text-sm bg-primary/10 hover:bg-primary/20 rounded-lg px-3 py-2 border border-secondary">
        <p className="size-full text-wrap break-words select-none whitespace-pre-wrap">
          {card?.content}
        </p>
      </div>
    </>
  );
}
