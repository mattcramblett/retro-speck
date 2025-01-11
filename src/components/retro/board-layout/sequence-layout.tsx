import { useRetro, useUpdateTopic } from "@/hooks/retros/use-retro";
import { useTopic, useVotedTopics } from "@/hooks/topics/use-topics";
import { Card, Column, Participant, Retro } from "@/types/model";
import { RetroTopic } from "../topic/retro-topic";
import { RetroColumn } from "../retro-column";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/auth/use-user";
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import { useRetroCards } from "@/hooks/cards/use-retro-cards";
import { useParticipants } from "@/hooks/participants/use-participants";
import { useColumns } from "@/hooks/columns/use-columns";

export function SequenceLayout({
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
  const { data: retro } = useRetro(retroId);
  const { mutate: updateTopic, isPending: isPendingUpdate } =
    useUpdateTopic(retroId);

  // Pass these initial data for initial page loads
  useColumns(retroId, { initialData: initialColumns });
  useRetroCards({ retroId, initialData: initialCards });
  useParticipants(retroId, { initialData: initialParticipants });

  const { data: sortedTopics, getTopicIndex } = useVotedTopics(retroId);

  const { data: topic, isPending } = useTopic(
    retroId,
    retro?.currentTopicId || 0,
    {
      enabled: !!retro?.currentTopicId,
    },
  );
  const { data: user } = useUser();
  const isFacilitator = retro?.facilitatorUserId === user?.id;

  const handleAdvance = () => {
    if (retro?.currentTopicId) {
      updateTopic(sortedTopics[getTopicIndex(retro?.currentTopicId) + 1].id);
    }
  };

  const handleReverse = () => {
    if (retro?.currentTopicId) {
      updateTopic(sortedTopics[getTopicIndex(retro?.currentTopicId) - 1].id);
    }
  };

  const reverseEnabled =
    isFacilitator &&
    !isPendingUpdate &&
    retro?.currentTopicId &&
    getTopicIndex(retro?.currentTopicId || 0) > 0;

  const advanceEnabled =
    isFacilitator &&
    !isPendingUpdate &&
    retro?.currentTopicId &&
    getTopicIndex(retro?.currentTopicId || 0) < sortedTopics.length - 1;

  return (
    <div className="flex w-full items-center justify-center overflow-scroll px-8">
      <div className="flex items-center gap-4">
        {isFacilitator && (
          <Button disabled={!reverseEnabled} onClick={handleReverse}>
            <MoveLeft />
          </Button>
        )}
        {isPending && <Skeleton className="rounded-xl w-full h-48" />}
        {!isPending && (
          <RetroColumn>
            <RetroTopic retroId={retroId} topicId={topic?.id || 0} />
            <div className="text-muted-foreground">
              {`${getTopicIndex(retro?.currentTopicId || 0)} of ${sortedTopics.length} topics complete`}
            </div>
          </RetroColumn>
        )}
        {isFacilitator && (
          <Button disabled={!advanceEnabled} onClick={handleAdvance}>
            <MoveRight />
          </Button>
        )}
      </div>
    </div>
  );
}
