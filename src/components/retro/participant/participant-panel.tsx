import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/auth/use-user";
import {
  useParticipants,
} from "@/hooks/participants/use-participants";
import { useRetro } from "@/hooks/retros/use-retro";
import { Participant } from "@/types/model";
import { Minimize2, PanelLeft } from "lucide-react";
import { useState } from "react";
import { AdmittedParticipant } from "./admitted-participant";
import { WaitingParticipant } from "./waiting-participant";
import { LinkCopy } from "./link-copy";

export function ParticipantPanel({
  retroId,
  initialParticipants,
  onError,
}: {
  retroId: number;
  initialParticipants: Participant[];
  onError: (title: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const { data: participants } = useParticipants(retroId, {
    initialData: initialParticipants,
  });
  const { data: retro } = useRetro(retroId);
  const { data: user } = useUser();
  const isFacilitator = retro?.facilitatorUserId === user?.id;

  // Handle optimistic update with `variables`
  const admitted = participants?.filter((p) => p.isAccepted) || [];
  const notAdmitted = participants?.filter((p) => !p.isAccepted) || [];

  if (!isExpanded) {
    return (
      <div className="z-10 flex flex-col h-full bg-card max-w-12 overflow-x-scroll tiny-scrollbar px-4 py-4 animate-in animate-out">
        <Button variant="icon" size="bare" onClick={() => setIsExpanded(true)}>
          <PanelLeft className="text-muted-foreground" size={12} />
        </Button>
      </div>
    );
  }

  return (
    <div className="z-10 flex flex-col h-full bg-card min-w-60 xl:min-w-80 overflow-x-scroll tiny-scrollbar px-4 py-4 animate-in animate-out">
      <div className="w-full flex items-center gap-2 mb-4">
        <Button variant="icon" size="bare" onClick={() => setIsExpanded(false)}>
          <Minimize2 className="text-muted-foreground" size={14} />
        </Button>
        <h2 className="font-black text-xl text-foreground">{retro?.name}</h2>
      </div>
      <LinkCopy />
      <Separator className="my-3" />
      <h2 className="font-bold text-md pt-4 pb-2">Participants</h2>
      <div className="size-full flex flex-col gap-2">
        {admitted.map((p) => (
          <AdmittedParticipant
            key={p.id}
            retroId={retroId}
            participant={p}
            isFacilitator={isFacilitator}
            onError={onError}
          />
        ))}
        {notAdmitted.length > 0 && (
          <div className="text-sm text-muted-foreground mt-4">
            Waiting to be let in:
          </div>
        )}
        {notAdmitted.map((p) => (
          <WaitingParticipant
            key={p.id}
            participant={p}
            isFacilitator={isFacilitator}
            onError={onError}
          />
        ))}
      </div>
    </div>
  );
}
