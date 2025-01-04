import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/auth/use-user";
import { useUpdateParticipant } from "@/hooks/participants/use-participants";
import { useRetro } from "@/hooks/retros/use-retro";
import { cn } from "@/lib/utils";
import { Participant } from "@/types/model";
import { UserRound, UserRoundX } from "lucide-react";

export function AdmittedParticipant({
  retroId,
  participant,
  isFacilitator,
  onError,
}: {
  retroId: number,
  participant: Participant,
  isFacilitator: boolean,
  onError: (e: string) => void,
}) {
  const { data: retro } = useRetro(retroId);
  const { data: user } = useUser();

  const {
    mutate: updateParticipant,
    isPending,
    variables,
  } = useUpdateParticipant({
    onError: () => onError("Failed to update participant"),
  });

  const handleAdmission = (id: number, isAccepted: boolean) => {
    updateParticipant({ id, isAccepted });
  };

  return (
    <div className="flex items-center gap-2">
      {isFacilitator && (
        <Button
          variant="icon"
          size="bare"
          onClick={() => handleAdmission(participant.id, false)}
          disabled={participant.userId === retro?.facilitatorUserId || isPending}
          title={`Reject ${participant.name}`}
        >
          <UserRoundX className="text-muted-foreground" size={12} />
        </Button>
      )}
      {!isFacilitator && (
        <UserRound className="text-muted-foreground" size={12} />
      )}
      <div
        className={cn(
          "text-sm flex gap-1",
          isPending && variables?.id === participant.id
            ? "text-muted-foreground animate-pulse"
            : null,
        )}
      >
        {participant.name}
        {participant.userId === user?.id && (
          <div className="text-muted-foreground">{"(you)"}</div>
        )}
        {participant.userId !== user?.id &&
          participant.userId === retro?.facilitatorUserId && (
            <div className="text-muted-foreground">{"(facilitator)"}</div>
          )}
      </div>
    </div>
  );
}

