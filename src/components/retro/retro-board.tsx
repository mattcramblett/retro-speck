"use client";

import { Card, Column, getPhase, Participant, Retro } from "@/types/model";
import { ColumnBoard } from "@/components/retro/board-layout/column-board";
import { useRetro } from "@/hooks/retros/use-retro";

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
  const { data: retro } = useRetro(retroId, { initialData: initialRetro });
  const phase = getPhase(retro?.phase);

  return (
    <div className="flex h-full p-4 gap-4 max-h-full overflow-x-auto tiny-scrollbar overscroll-x-none">
      {phase.columnLayout && (
        <ColumnBoard
          initialRetro={initialRetro}
          initialColumns={initialColumns}
          initialCards={initialCards}
        />
      )}
    </div>
  );
}
