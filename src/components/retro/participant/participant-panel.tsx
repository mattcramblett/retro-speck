"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/auth/use-user";
import {
  useParticipants,
  useUpdateParticipant,
} from "@/hooks/participants/use-participants";
import { useRetro } from "@/hooks/retros/use-retro";
import { cn } from "@/lib/utils";
import { Participant } from "@/types/model";
import {
  ChevronLeft,
  PanelLeft,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";
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

  const {
    mutate: updateParticipant,
    isPending,
    isError,
    variables,
  } = useUpdateParticipant();

  const handleAdmission = (id: number, isAccepted: boolean) => {
    updateParticipant({ id, isAccepted });
  };

  // Handle optimistic update with `variables`
  const admitted =
    participants?.filter(
      (p) =>
        (p.id === variables?.id && variables?.isAccepted) ||
        p.isAccepted,
    ) || [];
  const notAdmitted =
    participants?.filter(
      (p) =>
        (p.id === variables?.id && !variables?.isAccepted) ||
        !p.isAccepted,
    ) || [];

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
                onClick={() => handleAdmission(p.id, false)}
                disabled={p.userId === retro?.facilitatorUserId || isPending}
                title={`Reject ${p.name}`}
              >
                <UserRoundX className="text-muted-foreground" size={12} />
              </Button>
            )}
            <div
              className={cn(
                "text-sm flex gap-1",
                isPending && variables?.id === p.id
                  ? "text-muted-foreground animate-pulse"
                  : null,
              )}
            >
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
                  onClick={() => handleAdmission(p.id, true)}
                  title={`Admit ${p.name}`}
                  disabled={isPending}
                >
                  <UserRoundCheck className="text-muted-foreground" size={12} />
                </Button>
              )}
              <div
                className={cn(
                  "text-sm",
                  isPending && variables?.id === p.id
                    ? "text-muted-foreground animate-pulse"
                    : null,
                )}
              >
                {p.name}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
