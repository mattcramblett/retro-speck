import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/auth/use-user";
import { useParticipants } from "@/hooks/participants/use-participants";
import { useRetro } from "@/hooks/retros/use-retro";
import { Participant } from "@/types/model";
import { ChevronLeft, PanelLeft, UserRoundCheck, UserRoundX } from "lucide-react";
import { useState } from "react";

export function ParticipantPanel({
  retroId,
  initialParticipants,
}: {
  retroId: number;
  initialParticipants: Participant[];
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const { data: participants } = useParticipants(retroId, {
    initialData: initialParticipants,
  });
  const { data: retro } = useRetro(retroId);
  const { data: user } = useUser();
  const isFacilitator = retro?.facilitatorUserId === user?.id;

  const admitted = participants?.filter((p) => p.isAccepted) || [];
  const notAdmitted = participants?.filter((p) => !p.isAccepted) || [];

  if (!isExpanded) {
    return (
      <div className="flex flex-col h-full bg-card max-w-12 overflow-x-scroll tiny-scrollbar px-4 py-4 animate-in animate-out">
        <Button variant="icon" size="bare" onClick={() => setIsExpanded(true)}>
          <PanelLeft className="text-muted-foreground" size={12} />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card min-w-60 max-w-72 overflow-x-scroll tiny-scrollbar px-4 py-4 animate-in animate-out">
      <div className="w-full flex items-center gap-2 mb-2">
        <Button variant="icon" size="bare" onClick={() => setIsExpanded(false)}>
          <ChevronLeft className="text-muted-foreground" size={12} />
        </Button>
        <h2 className="font-bold text-md">Participants</h2>
      </div>
      <Separator className="mb-3" />
      <div className="size-full flex flex-col gap-2">
        {admitted.map((p) => (
          <div className="flex items-center gap-2" key={p.id}>
            {isFacilitator && (
              <Button
                variant="icon"
                size="bare"
                onClick={() => setIsExpanded(false)}
                disabled={p.userId === retro?.facilitatorUserId}
                title={`Reject ${p.name}`}
              >
                <UserRoundX className="text-muted-foreground" size={12} />
              </Button>
            )}
            <div className="text-sm flex gap-1">
              {p.name}
              {p.userId === user?.id && (
                <div className="text-muted-foreground">{"(you)"}</div>
              )}
              {p.userId !== user?.id &&
                p.userId === retro?.facilitatorUserId && (
                  <div className="text-muted-foreground">{"(facilitator)"}</div>
                )}
            </div>
          </div>
        ))}
        {isFacilitator && notAdmitted.length > 0 && (
          <div className="text-sm text-muted-foreground mt-4">
            Waiting to be let in:
          </div>
        )}
        {isFacilitator &&
          notAdmitted.map((p) => (
            <div className="flex items-center gap-2" key={p.id}>
              {isFacilitator && (
                <Button
                  variant="icon"
                  size="bare"
                  onClick={() => setIsExpanded(false)}
                  title={`Admit ${p.name}`}
                >
                  <UserRoundCheck className="text-muted-foreground" size={12} />
                </Button>
              )}
              <div className="text-sm">
                {p.name}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
