"use client";

import { Card, Column, Participant, Retro } from "@/types/model";
import { RetroCard } from "./retro-card";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useCards } from "@/hooks/cards/use-cards";

export function RetroBoard({
  initialRetro,
  initialColumns,
  initialCards,
  initialParticipants,
}: {
  initialRetro: Retro;
  initialColumns: Column[];
  initialCards: Card[];
  initialParticipants: Participant[];
}) {
  const retroId = initialRetro.id;

  const { data: cards } = useCards({
    retroId,
    initialData: initialCards,
  });
  
  return (
    <div className="flex h-full p-4 gap-4 max-h-full overflow-x-auto tiny-scrollbar overscroll-x-none">
      {initialColumns.map((column) => (
        <div
          key={column.id}
          className="flex flex-col max-h-full overflow-y-scroll tiny-scrollbar bg-card items-center gap-4 py-4 px-3 border border-primary/10 rounded-lg min-w-80 max-w-80"
        >
          <div className="flex w-full items-start py-2 px-2">
            <h2 className="font-black text-xl">{column.name}</h2>
          </div>
          <Button variant="outline" className="w-full min-h-10">
            <Plus />
          </Button>
          {cards
            .filter((c) => c.retroColumnId === column.id)
            .map((card) => (
              <RetroCard key={card.id} content={card.content} />
            ))}
        </div>
      ))}
    </div>
  );
}
