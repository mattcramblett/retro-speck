"use client";

import { Card, Column, getPhase, Participant, Retro } from "@/types/model";
import { ColumnBoard } from "@/components/retro/board-layout/column-board";
import { useRetro } from "@/hooks/retros/use-retro";
import { ConnectionStatus } from "./connection/connection-status";
import { PhaseNav } from "./phase/phase-nav";

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
    <>
      <ConnectionStatus
        retroId={retroId}
        retroPublicId={initialRetro.publicId}
      />
      <div className="flex flex-col gap-2 size-full">
        <PhaseNav retroId={retroId} />
        {phase.columnLayout && (
          <ColumnBoard
            initialRetro={initialRetro}
            initialColumns={initialColumns}
            initialCards={initialCards}
          />
        )}
      </div>
    </>
  );
}
