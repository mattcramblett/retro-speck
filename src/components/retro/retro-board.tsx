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
        <div key={column.id} className="flex flex-col items-center">
          <div className="flex w-full items-start pb-4 px-2 overflow-x-scroll">
            <h2 className="font-black text-xl">{column.name}</h2>
          </div>
          <div
            key={column.id}
            className="flex flex-col max-h-full overflow-y-scroll tiny-scrollbar bg-card items-center gap-4 py-4 px-3 border border-primary/10 rounded-lg min-w-80 max-w-80"
          >
            <Button variant="outline" className="w-full min-h-10">
              <Plus />
            </Button>
            {cards
              .filter((c) => c.retroColumnId === column.id)
              .sort((a, b) => a.id - b.id) // sort for consistency
              .map((card) => (
                <RetroCard key={card.id} initialCard={card} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
