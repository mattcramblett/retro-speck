"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentParticipant } from "@/hooks/participants/use-participants";
import { useRetro } from "@/hooks/retros/use-retro";
import { useCreateVote, useDeleteVote, useVotes } from "@/hooks/votes/use-votes";
import { getPhase, Vote } from "@/types/model";
import { VoteBubbles } from "./votes-bubbles";

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

  const { data: allVotes } = useVotes(retroId, {
    select: (allVotes: Vote[]) =>
      allVotes.filter((v) =>
        onlyCurrentParticipant // Only show this participant's votes if everyone else is still voting.
          ? v.participantId === currentParticipant?.id
          : true,
      ),
  });

  const { data: votes, isPending } = useVotes(retroId, {
    enabled: phase.showsVotes,
    select: (allVotes: Vote[]) =>
      allVotes.filter(
        (v) =>
          v.topicId === topicId &&
          (onlyCurrentParticipant // Only show this participant's votes if everyone else is still voting.
            ? v.participantId === currentParticipant?.id
            : true),
      ),
  });

  const votesExceeded =
    (allVotes?.length || 0) >= (currentParticipant?.voteAllotment || 0);

  const { mutate: createVote, isPending: isPendingCreateVote } =
    useCreateVote();
  const { mutate: removeVote, isPending: isPendingRemoveVote } =
    useDeleteVote();

  if (isPending) {
    return <Skeleton className="h-6 max-w-24 rounded-md" />;
  }

  const label = phase.name === "voting" ? "My votes:" : "Votes:";

  return (
    <div className="flex items-center gap-1">
      <VoteBubbles
        votes={votes || []}
        label={label}
        showCreate={phase.name === "voting"}
        onCreate={() => createVote(topicId)}
        onRemove={() => removeVote(topicId)}
        buttonsEnabled={isPendingCreateVote || isPendingRemoveVote || votesExceeded}
      />
    </div>
  );
}
