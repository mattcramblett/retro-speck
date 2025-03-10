import {
  useAdvancePhase,
  useRetro,
  useUpdateTopic,
} from "@/hooks/retros/use-retro";
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
  const { mutate: advancePhase } = useAdvancePhase(retroId);

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
      const currentIndex = getTopicIndex(retro?.currentTopicId);
      if (currentIndex === sortedTopics.length - 1) {
        advancePhase();
      } else {
        updateTopic(sortedTopics[currentIndex + 1].id);
      }
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

  return (
    <div className="flex size-full items-center justify-center px-8">
      <div className="flex gap-4 h-full items-center">
        {isFacilitator && (
          <div className="h-full flex items-center">
            <Button disabled={!reverseEnabled} onClick={handleReverse}>
              <MoveLeft />
            </Button>
          </div>
        )}
        {isPending && <Skeleton className="rounded-xl w-full h-48" />}
        {!isPending && (
          <RetroColumn className="py-4">
            <RetroTopic retroId={retroId} topicId={topic?.id || 0} />
            <div className="text-muted-foreground">
              {`Topic ${getTopicIndex(retro?.currentTopicId || 0) + 1} of ${sortedTopics.length}`}
            </div>
          </RetroColumn>
        )}
        {isFacilitator && (
          <div className="h-full flex items-center">
            <Button onClick={handleAdvance}>
              <MoveRight />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
