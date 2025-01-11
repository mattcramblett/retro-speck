import { Title } from "@/components/brand/title";
import { useAdvancePhase, useRetro } from "@/hooks/retros/use-retro";
import { getPhase } from "@/types/model";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, Info } from "lucide-react";
import { useCurrentParticipant } from "@/hooks/participants/use-participants";
import { Button } from "@/components/ui/button";

export function PhaseNav({
  retroId,
  onError,
}: {
  retroId: number;
  onError: (title: string) => void;
}) {
  const { data: retro } = useRetro(retroId);
  const phase = getPhase(retro?.phase);

  const { mutate, isPending } = useAdvancePhase(retroId, {
    onError: () => onError("Unable to progress"),
  });

  const { data: participant } = useCurrentParticipant(retroId);

  const isFacilitator = participant?.userId === retro?.facilitatorUserId;

  return (
    <div className="z-10 flex justify-center w-full items-center bg-gradient">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-pointer">
              <Title className="text-secondary cursor-pointer my-0 py-1 text-md">
                {phase.name}
              </Title>
              <Info size={12} className="text-secondary" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{phase.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {isFacilitator && (
        <Button
          variant="link"
          className="px-1"
          disabled={isPending}
          onClick={() => mutate()}
        >
          <ArrowRight className="text-secondary" />
        </Button>
      )}
    </div>
  );
}
