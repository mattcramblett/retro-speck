"use client";

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
import { useParticipants } from "@/hooks/participants/use-participants";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function PhaseNav({ retroId }: { retroId: number }) {
  const { data: retro } = useRetro(retroId);
  const phase = getPhase(retro?.phase);

  const { mutate, isPending, isError } = useAdvancePhase(retroId);
  const { toast } = useToast();
  if (isError) {
    toast({
      variant: "destructive",
      title: "Could not update the retro",
      description:
        "There was a problem updating the retro. Please refresh the page and try again.",
    });
  }

  const { useCurrentParticipant } = useParticipants({ retroId });
  const { data: participant } = useCurrentParticipant();

  const isFacilitator = participant?.userId === retro?.facilitatorUserId;

  return (
    <div className="flex justify-center w-full items-center bg-gradient">
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
