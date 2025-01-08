"use client";

import { Card, Column, getPhase, Participant, Retro } from "@/types/model";
import { ColumnLayout } from "@/components/retro/board-layout/column-layout";
import { useRetro } from "@/hooks/retros/use-retro";
import { ConnectionStatus } from "./connection/connection-status";
import { PhaseNav } from "./phase/phase-nav";
import { SequenceLayout } from "./board-layout/sequence-layout";
import { SummaryLayout } from "./board-layout/summary-layout";
import { ParticipantPanel } from "./participant/participant-panel";
import { useToast } from "@/hooks/use-toast";

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

  const { toast } = useToast();
  const handleError = (title: string) => {
    toast({
      variant: "destructive",
      title,
      description: "Please refresh the page and try again.",
    });
  };

  return (
    <>
      <ConnectionStatus
        retroId={retroId}
        retroPublicId={initialRetro.publicId}
      />
      <div className="flex flex-col size-full">
        <PhaseNav retroId={retroId} onError={handleError} />
        <div className="flex size-full">
          <ParticipantPanel
            retroId={retroId}
            initialParticipants={initialParticipants}
            onError={handleError}
          />
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
      </div>
    </>
  );
}
