"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentParticipant } from "@/hooks/participants/use-participants";
import { useRetro } from "@/hooks/retros/use-retro";
import { useVotes } from "@/hooks/votes/use-votes";
import { getPhase, Vote } from "@/types/model";
import { PlusCircle } from "lucide-react";

export function TopicVotes({
  retroId,
  topicId,
}: {
  retroId: number;
  topicId: number;
}) {
  const { data: retro } = useRetro(retroId);
  const phase = getPhase(retro?.phase);
  const onlyCurrentParticipant = phase.name === "voting";

  const { data: currentParticipant } = useCurrentParticipant(retroId);

  const { data: votes, isPending } = useVotes(retroId, {
    enabled: phase.showsVotes,
    select: (allVotes: Vote[]) =>
      allVotes.filter(
        (v) =>
          v.topicId === topicId &&
          (onlyCurrentParticipant // Only show this participant's votes if everyone is still voting.
            ? v.participantId === currentParticipant?.id
            : true),
      ),
  });

  if (isPending) {
    return <Skeleton className="h-6 max-w-24 rounded-md" />;
  }

  const label =
    phase.name === "voting"
      ? `My votes ${votes?.length || 0}`
      : `Total votes: ${votes?.length || 0}`;

  return (
    <div className="flex items-center gap-1">
      <Badge
        variant={votes?.length ? "default" : "secondary"}
        className="w-fit my-1"
      >{label}</Badge>
      {phase.name === "voting" && (
        <Button variant="icon" size="bare">
          <PlusCircle className="text-card-foreground" />
        </Button>
      )}
    </div>
  );
}
