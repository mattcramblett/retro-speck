"use client";
import { DynamicTextarea } from "@/components/ui/dynamic-textarea";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { useParticipants } from "@/hooks/participants/use-participants";
import { Card } from "@/types/model";
import { useState, useEffect } from "react";

export function RetroCardDraft({
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
  const { mutate: updateCard } = useUpdateCard(initialCard.id, {
    debounce: true,
  });

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
    <>
      {participantOwnsCard && (
        <DynamicTextarea
          value={content}
          onChange={(e) => handleUpdate(e.target.value || "")}
          disabled={!isDraftState || !participantOwnsCard}
        />
      )}
      {!participantOwnsCard && (
        <div className="w-full max-w-md font-medium text-sm text-wrap bg-primary/10 hover:bg-primary/20 rounded-lg px-3 py-2 border border-secondary">
          <div className="size-full blur-sm text-wrap break-words select-none">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
