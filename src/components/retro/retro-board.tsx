"use client";

import { Card, Column, getPhase, Participant, Retro } from "@/types/model";
import { ColumnLayout } from "@/components/retro/board-layout/column-layout";
import { useRetro } from "@/hooks/retros/use-retro";
import { ConnectionStatus } from "./connection/connection-status";
import { PhaseNav } from "./phase/phase-nav";
import { SequenceLayout } from "./board-layout/sequence-layout";
import { SummaryLayout } from "./board-layout/summary-layout";

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
        {phase.layoutType === "column" && (
          <ColumnLayout
            initialRetro={initialRetro}
            initialColumns={initialColumns}
            initialCards={initialCards}
          />
        )}
        {phase.layoutType === "sequence" && (
          <SequenceLayout
            initialRetro={initialRetro}
            initialColumns={initialColumns}
            initialCards={initialCards}
            initialParticipants={initialParticipants}
          />
        )}
        {phase.layoutType === "summary" && (
          <SummaryLayout
            initialRetro={initialRetro}
            initialColumns={initialColumns}
            initialCards={initialCards}
            initialParticipants={initialParticipants}
          />
        )}
      </div>
    </>
  );
}
