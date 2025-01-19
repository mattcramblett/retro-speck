import { Button } from "@/components/ui/button";
import { useUpdateParticipant } from "@/hooks/participants/use-participants";
import { cn } from "@/lib/utils";
import { Participant } from "@/types/model";
import { UserRound, UserRoundCheck } from "lucide-react";

export function WaitingParticipant({
  participant,
  isFacilitator,
  onError,
}: {
  participant: Participant,
  isFacilitator: boolean
  onError: (e: string) => void,
}) {
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
          onClick={() => handleAdmission(participant.id, true)}
          title={`Admit ${participant.name}`}
          disabled={isPending}
        >
          <UserRoundCheck className="text-primary" size={12} />
        </Button>
      )}
      {!isFacilitator && (
        <UserRound className="text-muted-foreground" size={12} />
      )}
      <div
        className={cn(
          "text-sm",
          isPending && variables?.id === participant.id
            ? "text-muted-foreground animate-pulse"
            : null,
        )}
      >
        {participant.name}
      </div>
    </div>
  );
}

