"use client";

import { Card, Column, Participant, Retro } from "@/types/model";

export function RetroBoard({
  retro,
  columns,
  cards,
  participants,
}: {
  retro: Retro;
  columns: Column[];
  cards: Card[];
  participants: Participant[];
}) {
  return (
    <div className="flex h-full p-4 gap-4 max-h-full overflow-x-auto tiny-scrollbar overscroll-x-none">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex flex-col max-h-full overflow-y-scroll tiny-scrollbar bg-card items-center gap-4 py-4 px-3 border border-primary/10 rounded-lg min-w-80 max-w-80"
        >
          <div className="flex w-full items-start py-2 px-2">
            <h2 className="font-black text-xl">{column.name}</h2>
          </div>
          {cards
            .filter((c) => c.retroColumnId === column.id)
            .map((card) => (
              <div
                key={card.id}
                className="p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors w-full"
              >
                {card.content}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
